#!/bin/sh
# kb-verify-record-transcript.sh — SubagentStop hook for kb-factory-verify.
#
# The harness hands us each finishing sub-agent's real transcript path. Recording it here means the
# skill never has to glob ~/.claude/projects/**/subagents/ to find ground truth for a batch.
#
# Secondary path only: scripts/extract-agent-calls.mjs matches transcripts by brief content
# (output dir + first Case: line) plus the sidecar agent-<id>.meta.json's agentType first; this
# index is a fallback when that scan needs a narrower candidate list.
#
# stdin: {agent_id, agent_type, agent_transcript_path, ...}
# Appends one line per agent to reports/.transcript-index.jsonl. Never blocks anything.
#
# JSON is read with jq when it is on PATH, else with `node -e` (node >= 20). This hook must never
# block a subagent: if neither interpreter is available we log an error line to the index (best
# effort) and exit 0.

set -u

IN=$(cat)
[ -z "$IN" ] && exit 0

PROJECT="${CLAUDE_PROJECT_DIR:-$(pwd)}"
# Shared with kb-verify-scope-fence.sh so both hooks agree on where the factory is.
. "$(dirname "$0")/kb-verify-roots.sh"
INDEX="$REPORTS/.transcript-index.jsonl"

JSON_TOOL=""
if command -v jq >/dev/null 2>&1; then
  JSON_TOOL=jq
elif command -v node >/dev/null 2>&1; then
  JSON_TOOL=node
fi

if [ -z "$JSON_TOOL" ]; then
  if [ -d "$(dirname "$INDEX")" ]; then
    printf '{"ts":"%s","error":"neither jq nor node available to parse hook payload"}\n' \
      "$(date -u +%Y-%m-%dT%H:%M:%SZ)" >> "$INDEX" 2>/dev/null
  fi
  exit 0
fi

# j <dotted.field> — print the field's string value, or empty.
j() {
  if [ "$JSON_TOOL" = jq ]; then
    printf '%s' "$IN" | jq -r ".$1 // empty" 2>/dev/null
  else
    KVRT_JSON="$IN" KVRT_FIELD="$1" node -e '
      let val;
      try { val = JSON.parse(process.env.KVRT_JSON || "null"); } catch (e) { process.exit(0); }
      const field = process.env.KVRT_FIELD || "";
      for (const part of field.split(".")) {
        if (val !== null && typeof val === "object" && Object.prototype.hasOwnProperty.call(val, part)) {
          val = val[part];
        } else {
          val = undefined;
          break;
        }
      }
      if (val === undefined || val === null) process.stdout.write("");
      else if (typeof val === "string") process.stdout.write(val);
      else process.stdout.write(String(val));
    ' 2>/dev/null
  fi
}

AGENT=$(j 'agent_type')
case "$AGENT" in *kb-discover-*|*kb-factory-verify-discover-*) ;; *) exit 0 ;; esac

[ -d "$(dirname "$INDEX")" ] || exit 0

printf '{"ts":"%s","agentId":"%s","agentType":"%s","transcript":"%s"}\n' \
  "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$(j 'agent_id')" "$AGENT" "$(j 'agent_transcript_path')" \
  >> "$INDEX" 2>/dev/null

exit 0
