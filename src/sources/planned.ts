import type { DocSource, GrepArgs, GrepResult, LayerStatus, ListArgs, ListResult, ReadArgs, ReadResult } from "../types.js";

/** A known layer whose directory has no `index.md` yet: every call answers empty plus a `planned` notice. */
export class PlannedSource implements DocSource {
  constructor(
    readonly layer: string,
    private readonly message: string,
  ) {}

  private notice(): string {
    return `[${this.layer}] planned: ${this.message}`;
  }

  status(): LayerStatus {
    return { layer: this.layer, status: "planned", synonyms: false, integrity: "unverified", notices: [this.notice()] };
  }

  /** A planned layer serves no files, so every file is absent (keeps composed-view caches keyed). */
  fileStamp(_path: string): null {
    return null;
  }

  list(args: ListArgs): ListResult {
    return { path: args.path, entries: [], truncated: false, notices: [this.notice()] };
  }

  async grep(args: GrepArgs): Promise<GrepResult> {
    const mode = args.mode ?? "content";
    const res: GrepResult = { truncated: false, notices: [this.notice()] };
    if (mode === "content") res.matches = [];
    else if (mode === "files") res.files = [];
    else res.counts = [];
    return res;
  }

  async read(args: ReadArgs): Promise<ReadResult> {
    return {
      path: args.path,
      frontmatter: {},
      raw: "",
      lineFrom: 0,
      lineTo: 0,
      totalLines: 0,
      citation: "",
      truncated: false,
      notices: [this.notice()],
    };
  }
}
