export interface ParsedGithubTree { owner: string; repo: string; branch: string; }

/** Parses "https://github.com/{owner}/{repo}/tree/{branch}". Returns undefined if `url`
 *  isn't in that exact shape (branch may itself contain slashes, hence the greedy tail). */
export function parseGithubTreeUrl(url: string): ParsedGithubTree | undefined {
  const m = /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/tree\/(.+)$/.exec(url);
  return m ? { owner: m[1], repo: m[2], branch: m[3] } : undefined;
}

export function githubTreeApiUrl(p: ParsedGithubTree): string {
  return `https://api.github.com/repos/${p.owner}/${p.repo}/git/trees/${p.branch}?recursive=1`;
}

export function githubRawContentUrl(p: ParsedGithubTree, path: string): string {
  return `https://raw.githubusercontent.com/${p.owner}/${p.repo}/${p.branch}/${path}`;
}

export function githubBranchHeadUrl(p: ParsedGithubTree): string {
  return `https://api.github.com/repos/${p.owner}/${p.repo}/git/refs/heads/${p.branch}`;
}
