import { mkdirSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { sha256 } from "./hash.js";
import { sanitizeSourceText } from "./sanitize.js";

const ALLOWED_CONTENT_TYPES = ["text/markdown", "text/plain", "text/html", "application/json", "application/xml", "text/xml"];

export interface FetchLimits {
  allowlistHosts: string[];
  timeoutMs: number;
  maxRedirects: number;
  maxBodyBytes: number;
}

export class FetchAbortError extends Error {}

function assertAllowedHost(url: URL, allowlist: string[]): void {
  if (url.protocol !== "https:") throw new FetchAbortError(`refusing non-https URL: ${url.protocol}`);
  // `URL` always lowercases `hostname` (hostnames are case-insensitive per DNS); compare
  // case-insensitively so a mixed-case allowlist entry (e.g. an Algolia appId-derived host,
  // which Algolia itself presents in mixed case) still matches.
  if (!allowlist.some((h) => h.toLowerCase() === url.hostname)) throw new FetchAbortError(`host not allowlisted: ${url.hostname}`);
}

/**
 * Rate-limited, allowlisted fetch (refresh spec, Security C7/C8). Follows up to
 * `maxRedirects` manually so every hop is re-validated against the allowlist and
 * credentials never survive a redirect (no credentials are ever sent in the first
 * place — these are all public, unauthenticated endpoints plus an optional
 * `Authorization` header for the GitHub API only).
 */
export async function fetchLimited(
  urlStr: string,
  limits: FetchLimits,
  init?: { headers?: Record<string, string>; method?: "GET" | "POST"; body?: string },
): Promise<{ status: number; ok: boolean; contentType: string; body: string }> {
  let url = new URL(urlStr);
  assertAllowedHost(url, limits.allowlistHosts);
  let redirects = 0;
  for (;;) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), limits.timeoutMs);
    let res: Response;
    try {
      res = await fetch(url, {
        method: init?.method ?? "GET",
        body: init?.body,
        redirect: "manual",
        signal: controller.signal,
        headers: { "user-agent": "ShopwareDevKnowledgeBase-ingest/0.1", ...(init?.headers ?? {}) },
      });
    } finally {
      clearTimeout(timer);
    }
    if (res.status >= 300 && res.status < 400 && res.headers.get("location")) {
      redirects++;
      if (redirects > limits.maxRedirects) throw new FetchAbortError(`too many redirects: ${urlStr}`);
      url = new URL(res.headers.get("location")!, url);
      assertAllowedHost(url, limits.allowlistHosts);
      continue;
    }
    const contentType = (res.headers.get("content-type") ?? "").split(";")[0].trim();
    if (res.ok && contentType && !ALLOWED_CONTENT_TYPES.includes(contentType)) {
      throw new FetchAbortError(`content-type not allowlisted: ${contentType} (${urlStr})`);
    }
    const buf = await res.arrayBuffer();
    if (buf.byteLength > limits.maxBodyBytes) {
      throw new FetchAbortError(`body exceeds ${limits.maxBodyBytes} bytes: ${urlStr}`);
    }
    return { status: res.status, ok: res.status >= 200 && res.status < 300, contentType, body: Buffer.from(buf).toString("utf8") };
  }
}

/** Simple per-host token-bucket-ish limiter: at most one call every `1000 / perSecond` ms per host. */
export class HostRateLimiter {
  private nextAt = new Map<string, number>();
  constructor(private readonly perSecondByHost: Record<string, number>, private readonly defaultPerSecond = 4) {}

  async wait(host: string): Promise<void> {
    const perSecond = this.perSecondByHost[host] ?? this.defaultPerSecond;
    const gapMs = 1000 / perSecond;
    const now = Date.now();
    const earliest = Math.max(now, this.nextAt.get(host) ?? 0);
    this.nextAt.set(host, earliest + gapMs);
    const delay = earliest - now;
    if (delay > 0) await new Promise((r) => setTimeout(r, delay));
  }
}

/** `.cache/src/<sourceDir>/<hash>.txt` — the one place that knows the cache filename
 *  convention, so a page's cache location is always derivable from `(sourceId, hash)`
 *  instead of needing its own stored field (kb-sw-platform-refresh.md, "Ingestion state"). */
export function cacheFilePath(cacheSrcDir: string, hash: string): string {
  return resolve(cacheSrcDir, `${hash}.txt`);
}

/**
 * Sanitises and writes fetched source text to `.cache/src/<hash>.txt`; returns the cache
 * path and content hash. Pass `knownHash` when the caller already has a hash that
 * identifies this content before sanitizing (dev pages: the git blob SHA, known from the
 * tree API pre-fetch) so the cache filename and the diffing hash are the same value —
 * otherwise one is computed from the sanitized bytes (merchant: no pre-fetch hash exists).
 */
export function writeSourceCache(cacheSrcDir: string, rawText: string, knownHash?: string): { cachePath: string; contentHash: string } {
  const sanitized = sanitizeSourceText(rawText);
  const contentHash = knownHash ?? sha256(sanitized);
  const cachePath = cacheFilePath(cacheSrcDir, contentHash);
  if (!existsSync(cachePath)) {
    mkdirSync(cacheSrcDir, { recursive: true });
    writeFileSync(cachePath, sanitized, "utf8");
  }
  return { cachePath, contentHash };
}

export function readSourceCache(cachePath: string): string {
  return readFileSync(cachePath, "utf8");
}
