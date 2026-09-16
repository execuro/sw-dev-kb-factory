/**
 * `wiki:eval` — Phase 8 (refresh spec). NOT YET IMPLEMENTED.
 *
 * Deliberately left as a documented stub: it is a diagnostic-only, internal
 * build-time sanity check (hit@2-calls grep-replay over
 * `ingest/platform/eval/queries.json`, rubric in `ingest/shared/eval-rubric.md`)
 * and produces no wiki artefacts, so the rest of the pipeline (sync/pages/hubs/
 * build/synonyms/lint) must be able to run without it. It always exits 0 with
 * `"implemented": false` so a caller can detect and skip its gate rather than
 * treating a missing feature as a pipeline failure.
 *
 * TODO: once `ingest/platform/eval/queries.json` has real queries (populate
 * after the first `wiki:build`), implement the grep-replay driver described in
 * `ingest/shared/eval-rubric.md` and drop the `implemented: false` flag.
 */
import type { CliFlags } from "../shared/types.js";

export async function run(_flags: CliFlags): Promise<number> {
  process.stderr.write(
    "wiki:eval: not yet implemented — this is a diagnostic-only phase (refresh spec Phase 8); the pipeline does not depend on it. See ingest/shared/eval-rubric.md.\n",
  );
  process.stdout.write(
    JSON.stringify({ cmd: "eval", implemented: false, queries: 0, hitAt2Calls: null, hitAt2CallsWithoutSynonyms: null, misses: [] }) + "\n",
  );
  return 0;
}
