# Releasing `@execuro-sw-ecosystem/sw-dev-knowledge-base-mcp`

The maintainer checklist for everything `scripts/pack.mjs` and `.github/workflows/release.yml`
cannot do on their own: the one-time npm setup, tagging, the MCP Registry follow-up, and
post-publish verification.

**Command discipline.** This document *describes* what a human runs; read each step before typing
it. Several are irreversible — see [§4](#4-irreversibility--read-before-publishing).

## 1. One-time npm setup (before the first tag)

The `execuro-sw-ecosystem` npm org must exist, with 2FA enabled on the owner account. What remains
is **trusted publishing**, so that the `npm publish --provenance` step in
`.github/workflows/release.yml` works: provenance cannot be produced from a laptop, it requires
OIDC from a supported CI provider. That is why the workflow requests `id-token: write` and installs
`npm@^11.5.1`.

Steps, as far as verifiable from npm's own trusted-publishing documentation:

1. Sign in to <https://www.npmjs.com/> as an org owner, with 2FA enabled.
2. Open the package's **Settings → Trusted Publisher** page and add a GitHub Actions trusted
   publisher: repository `execuro/sw-dev-kb-factory`, workflow file `release.yml`, environment
   left blank unless one is added to the workflow later.
3. Save. No secret is created or stored in the repository — the workflow has no `NPM_TOKEN`.

**Unverified — settle before relying on it.** Whether npm lets you configure a trusted publisher
for a package name that does not exist yet (i.e. before any version has ever been published) is
not confirmed either way. Settle it by attempting step 2 with the real package name; if the
Trusted Publisher page or an equivalent flow is unavailable for an unpublished name, use the
fallback:

- **Fallback.** Publish `0.1.0` once manually, without `--provenance`, from a maintainer's machine
  (`npm publish --access public`, on the tarball `npm run pack` produces — see
  [§4](#4-irreversibility--read-before-publishing)). Once the name exists on the registry,
  configure trusted publishing (step 2) so every release from `0.2.0` onward goes through CI with
  `--provenance`.

## 2. The release itself

Run in order. Stop and fix at the first failure — nothing below should be worked around.

```sh
# 1. Gates green locally, on the commit you intend to tag.
npm test                    # build + full suite
npm run wiki:lint           # blocking schema/link/id/size checks
npm run pack -- --dry-run   # published-files allow-list + docs-corpus refusal probe

# 2. Bump package.json's "version" if this release changes it, commit, push.
git add package.json CHANGELOG.md
git commit -m "Release <version>"
git push

# 3. Tag EXACTLY matching package.json's version (the workflow fails the build otherwise —
#    see release.yml's "Verify the tag matches package.json's version" step).
git tag v<version>          # e.g. v0.1.0, no leading zeros mismatch, no build metadata
git push origin v<version>
```

Then watch the release workflow run for that tag (GitHub Actions tab). It re-runs typecheck,
`npm test`, `wiki:lint`, `pack` (real pack, not dry-run) and only then
`npm publish --provenance --access public`.

### The MCP Registry entry is a manual follow-up

The workflow's last step only prints instructions; it is `continue-on-error`, so it shows a
warning rather than failing the run, and it submits nothing. Submission is deliberately not
automated: the non-interactive OIDC login flags for the registry CLI are not confirmed, and a
guessed step would fail mid-release, after `npm publish` has already burned the version.

After the workflow finishes, a maintainer must:

1. Build or install `mcp-publisher` from <https://github.com/modelcontextprotocol/registry>
   (`make publisher`). It is not an npm package and is not a devDependency here.
2. Write or update `server.json` at the repository root, against the schema the registry
   documents. Its `name` must equal `package.json`'s `mcpName`
   (`io.github.execuro/sw-dev-knowledge-base-mcp`), and its `version`, plus
   `packages[0].version`, must match the version just published;
   `packages[0].identifier` is the npm package name.
3. `mcp-publisher login github` — the device-code flow, as a maintainer with access to the
   `execuro` namespace, since an `io.github.execuro/…` name authenticates as that GitHub org.
4. `mcp-publisher publish` from the repository root, then confirm the
   <https://modelcontextprotocol.io/registry> entry shows the published version.

## 3. After publishing

```sh
# Verify from a clean cache — no local install, no stale npx cache.
npx clear-npx-cache 2>/dev/null; npx -y @execuro-sw-ecosystem/sw-dev-knowledge-base-mcp@<version>
```

It should start and respond as a stdio MCP server (Ctrl-C to stop; there is no interactive
prompt). Then:

- Confirm the MCP Registry entry resolves and shows the just-published version.
- Repoint every consumer that pins an exact version of this package — pins are exact by design,
  so a release is invisible to them until they are bumped.

## 4. Irreversibility — read before publishing

`npm unpublish` only works for **72 hours** after publish, and only if no other package on the
registry has come to depend on it in the meantime. After that window, the name+version pair is
burned forever — no republish under the same version, ever, even after a fix.

**The last cheap checkpoint before that becomes true**: install the packed tarball into a
throwaway prefix and run the binary, *before* tagging.

```sh
npm run pack                          # real pack, writes dist-pack/*.tgz

# The tarball path MUST be absolute (or start with ./). Given a bare relative path such as
# "dist-pack/foo.tgz", npm treats it as a git shorthand and tries ssh://git@github.com/dist-pack/...
npm install --prefix /tmp/kb-check -g "$(ls "$PWD"/dist-pack/*.tgz)"

# Feed it one JSON-RPC line and keep stdin open; it answers on stdout and logs to stderr.
# Do not pipe into `head` — closing the pipe early makes a healthy server look silent.
{ printf '%s\n' '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"smoke","version":"0"}}}'; sleep 5; } \
  | /tmp/kb-check/bin/sw-dev-knowledge-base-mcp

rm -rf /tmp/kb-check dist-pack
```

If this fails, nothing has been published — fix it and re-run. Once the tag is pushed and the
workflow's `npm publish` step succeeds, this checkpoint has passed and the 72-hour clock is
running.
