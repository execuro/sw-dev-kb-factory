#!/bin/sh
# kb-verify-scope-fence.sh — PreToolUse fence for kb-factory-verify discover agents and the
# kb-factory-ingest-writer agent.
#
# The benchmark's premise is that each option sees only the corpus it is testing. This hook makes
# that true by construction: a discover agent's Read/Grep/Glob/Bash is DENIED at call time when it
# points outside that option's corpus root. Nothing reaches the agent, so there is no violation to
# score — which is why the rubric has no scope-violation metric.
#
# It also fences the four kb-factory-ingest-platform-docs writer agents, each to its own brief's
# read/write scope — the skill's own briefs state the same scope; this hook makes it enforced
# rather than advisory:
#   - kb-factory-ingest-writer: Read/Grep/Glob under the KB extras tree only (no vendor/shopware —
#     it never handles codeCheck items); Write under the KB's ingest .cache/out directory only —
#     not .cache/work or .cache/src, which hold the batch file and fetched source it reads.
#   - kb-factory-ingest-code-writer: Read/Grep/Glob under the KB extras tree and vendor/shopware
#     (its codeCheck read scope); Write under the KB's ingest .cache/out directory only.
#   - kb-factory-ingest-guideline-writer: same read scope as the code writer, plus vendor
#     administration AGENTS.md/technical-docs and the pinned 6.6 checkout —
#     all of which live under either root; Write under the KB's ingest .cache/out directory only.
#   - kb-factory-ingest-synonyms-writer: Read/Write confined to ingest/platform (batch file and
#     prompt only — no vendor, no wiki).
#
# Keyed on agent_type, so fs-wiki and fs-docs can be fenced differently inside one session, which
# no static permissions.deny rule can express.
#
# stdin: {tool_name, tool_input, agent_id, agent_type, cwd, ...}
# stdout on denial: PreToolUse deny decision. Silence = allow.
#
# JSON is read with jq when it is on PATH, else with `node -e` (node >= 20). If neither
# interpreter is available we cannot evaluate paths, but we can still tell the main thread
# (no agent_type at all) and an unfenced agent apart from a genuinely fenced one with a plain
# grep/sed extraction of agent_type — so only the fenced case fails closed; everything else is
# allowed through exactly as it would be with a JSON tool available.

set -u

IN=$(cat)
[ -z "$IN" ] && exit 0

JSON_TOOL=""
if command -v jq >/dev/null 2>&1; then
  JSON_TOOL=jq
elif command -v node >/dev/null 2>&1; then
  JSON_TOOL=node
fi

# The single definition of "this agent is fenced". Both the no-JSON fallback below and the roots
# `case` further down go through it, so the two can no longer drift apart — previously they were
# two hand-maintained copies of the same pattern list, and a new fenced agent added to one but not
# the other would have failed open exactly when the fence could not be evaluated.
is_fenced_agent() {
  case "$1" in
    *discover-fs-wiki*|kb-discover-fs-wiki*|\
    *discover-fs-docs*|kb-discover-fs-docs*|\
    *discover-vanilla*|kb-discover-vanilla*|\
    *kb-factory-ingest-code-writer*|*kb-factory-ingest-guideline-writer*|\
    *kb-factory-ingest-synonyms-writer*|*kb-factory-ingest-writer*) return 0 ;;
    *) return 1 ;;
  esac
}

if [ -z "$JSON_TOOL" ]; then
  FALLBACK_AGENT=$(printf '%s' "$IN" | grep -o '"agent_type"[[:space:]]*:[[:space:]]*"[^"]*"' | head -n1 | sed -E 's/.*"agent_type"[[:space:]]*:[[:space:]]*"([^"]*)".*/\1/')
  if [ -n "$FALLBACK_AGENT" ] && is_fenced_agent "$FALLBACK_AGENT"; then
    printf '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"kb-verify scope fence: neither jq nor node is available to parse the hook payload, so the fence cannot be evaluated for fenced agent %s; failing closed"}}\n' "$FALLBACK_AGENT"
  fi
  exit 0                              # main thread and unfenced agents pass, as with a JSON tool
fi

# j <dotted.field> — print the field's string value, or empty.
j() {
  if [ "$JSON_TOOL" = jq ]; then
    printf '%s' "$IN" | jq -r ".$1 // empty" 2>/dev/null
  else
    KVSF_JSON="$IN" KVSF_FIELD="$1" node -e '
      let val;
      try { val = JSON.parse(process.env.KVSF_JSON || "null"); } catch (e) { process.exit(0); }
      const field = process.env.KVSF_FIELD || "";
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

# paths <tool> — print tool_input.file_path/path/command(/pattern), one per line, skipping
# nulls. `pattern` is only ever a path candidate for tools where it names a glob (Glob) — for
# Grep it is a search regex (e.g. "/store-api/"), not a filesystem path, so it is excluded
# there; checking it as a path denied ordinary greps whose regex happened to look path-like.
paths() {
  tool="$1"
  if [ "$JSON_TOOL" = jq ]; then
    if [ "$tool" = "Grep" ]; then
      printf '%s' "$IN" | jq -r '[.tool_input.file_path, .tool_input.path, .tool_input.command] | map(select(. != null)) | .[]' 2>/dev/null
    else
      printf '%s' "$IN" | jq -r '[.tool_input.file_path, .tool_input.path, .tool_input.command, .tool_input.pattern] | map(select(. != null)) | .[]' 2>/dev/null
    fi
  else
    KVSF_JSON="$IN" KVSF_TOOL="$tool" node -e '
      let val;
      try { val = JSON.parse(process.env.KVSF_JSON || "null"); } catch (e) { process.exit(0); }
      const ti = (val && val.tool_input) || {};
      const fields = process.env.KVSF_TOOL === "Grep" ? [ti.file_path, ti.path, ti.command] : [ti.file_path, ti.path, ti.command, ti.pattern];
      for (const f of fields) {
        if (f !== undefined && f !== null) process.stdout.write(String(f) + "\n");
      }
    ' 2>/dev/null
  fi
}

AGENT=$(j 'agent_type')
[ -z "$AGENT" ] && exit 0          # main thread, not a fenced agent

PROJECT="${CLAUDE_PROJECT_DIR:-$(j 'cwd')}"
# Every root in one place, shared with kb-verify-record-transcript.sh and named identically to
# src/paths.ts's keys. Sourced rather than duplicated so a move needs one edit, not six.
. "$(dirname "$0")/kb-verify-roots.sh"
KB_EXTRAS="$KB_ROOT"
# Shopware source the code-reading writers may read. This is BOTH the pinned .sources/shopware
# checkouts and the surrounding project's installed vendor/, because codeCheck.projectRoot still
# resolves the newest Shopware version from the host project's vendor/ rather than from a pinned
# checkout. Drop the second root in the same commit that gives every version a pinned checkout.
VENDOR_SHOPWARE="$SHOPWARE $PROJECT/vendor/shopware"

# Which roots this agent may touch, and which are explicitly out of bounds.
# `vanilla` is defined by exclusion: everything a coding agent normally has, minus the four
# in-repo sources the other options are testing.
# READ_ROOTS/WRITE_ROOTS may each list several space-separated roots (allowlist mode only).
# WRITE_ROOTS defaults to READ_ROOTS when unset, for arms that never grant Write.
WRITE_ROOTS=""
case "$AGENT" in
  *discover-fs-wiki*|*discover-fs-wiki-batch*|kb-discover-fs-wiki*)
      READ_ROOTS="$WIKI" ; FORBID="$DOCS $PROJECT_WIKI" ; MODE="allowlist" ;;
  *discover-fs-docs*|kb-discover-fs-docs*)
      READ_ROOTS="$DOCS" ; FORBID="$WIKI $PROJECT_WIKI" ; MODE="allowlist" ;;
  *discover-vanilla*|kb-discover-vanilla*)
      READ_ROOTS="" ; FORBID="$WIKI $DOCS $PROJECT_WIKI" ; MODE="denylist" ;;
  *kb-factory-ingest-code-writer*)
      READ_ROOTS="$KB_EXTRAS $VENDOR_SHOPWARE" ; WRITE_ROOTS="$CACHE/out" ; FORBID="" ; MODE="allowlist" ;;
  *kb-factory-ingest-guideline-writer*)
      READ_ROOTS="$KB_EXTRAS $VENDOR_SHOPWARE" ; WRITE_ROOTS="$CACHE/out" ; FORBID="" ; MODE="allowlist" ;;
  *kb-factory-ingest-synonyms-writer*)
      READ_ROOTS="$KB_ROOT/ingest/platform" ; WRITE_ROOTS="$CACHE/out" ; FORBID="" ; MODE="allowlist" ;;
  *kb-factory-ingest-writer*)
      READ_ROOTS="$KB_EXTRAS" ; WRITE_ROOTS="$CACHE/out" ; FORBID="" ; MODE="allowlist" ;;
  *) exit 0 ;;                     # auditor, scorer, everything else: not fenced
esac

# Belt-and-braces on the one invariant that matters here: anything the case block fences must also
# be recognised by is_fenced_agent, which is what fails closed when no JSON parser is available.
if ! is_fenced_agent "$AGENT"; then
  printf '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"kb-verify scope fence: agent %s is fenced by the roots table but not by is_fenced_agent - the two lists have drifted; refusing rather than guessing"}}\n' "$AGENT"
  exit 0
fi

TOOL=$(j 'tool_name')
case "$TOOL" in Read|Grep|Glob|Bash|Write) ;; *) exit 0 ;; esac

deny() {
  # The run folder is written by the agent itself; never fence its own report out.
  printf '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"kb-verify scope fence: %s"}}\n' "$1"
  # Provenance: a fenced run is not identical to an unfenced one, so every denial is recorded.
  LOG="${KB_VERIFY_DENIAL_LOG:-}"
  [ -n "$LOG" ] && printf '{"ts":"%s","agent":"%s","tool":"%s","reason":"%s"}\n' \
      "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$AGENT" "$TOOL" "$1" >> "$LOG" 2>/dev/null
  exit 0
}

# normalize <path> — collapse "." and ".." segments without requiring the path to exist
# (a plain `realpath`/`readlink -f` would resolve a still-to-be-created Write target to
# nothing useful, and isn't guaranteed present anyway).
normalize() {
  path="$1"
  case "$path" in /*) : ;; *) path="/$path" ;; esac
  result=""
  IFS='/'
  set -f
  for part in $path; do
    case "$part" in
      "" | ".") continue ;;
      "..") result="${result%/*}" ;;
      *) result="$result/$part" ;;
    esac
  done
  set +f
  unset IFS
  [ -z "$result" ] && result="/"
  printf '%s' "$result"
}

# in_roots <path> <roots...> — 0 (true) when <path> equals one of <roots> or sits under
# "<root>/...". Both sides must already be normalize()d: a prefix match alone (as used to
# check FORBID above) would let "vendor/shopwareX" match a "vendor/shopware" root.
in_roots() {
  p="$1"
  shift
  for r in "$@"; do
    [ "$p" = "$r" ] && return 0
    case "$p" in "$r/"*) return 0 ;; esac
  done
  return 1
}

PATHS=$(paths "$TOOL")

# 1. Never let a fenced agent touch a forbidden root, whatever the tool.
for f in $FORBID; do
  case "$PATHS" in *"$f"*) deny "$f is a source under test in another option and is out of bounds for $AGENT" ;; esac
done

# 2. Allowlist agents must stay under their own root(s). Write checks WRITE_ROOTS (falling back
#    to READ_ROOTS when an arm never grants Write); every other tool checks READ_ROOTS.
if [ "$MODE" = "allowlist" ]; then
  # A Grep/Glob with no explicit path searches the whole repo (cwd = project root) and therefore
  # reaches every corpus, including roots this agent must not read — deny rather than allow. A
  # relative or `..`-bearing explicit path is resolved and normalized against `cwd` before the
  # root check below (it wouldn't otherwise be caught: the root check further down only looks
  # at absolute-looking tokens, and "vendor/.." never starts with "/").
  if [ "$TOOL" = "Grep" ] || [ "$TOOL" = "Glob" ]; then
    P=$(j 'tool_input.path')
    [ -z "$P" ] && deny "$TOOL without an explicit path searches the whole repository; pass a path under $READ_ROOTS"
    CWD=$(j 'cwd')
    [ -z "$CWD" ] && CWD="$PROJECT"
    case "$P" in /*) ABS_P="$P" ;; *) ABS_P="$CWD/$P" ;; esac
    ABS_P=$(normalize "$ABS_P")
    if ! in_roots "$ABS_P" $READ_ROOTS; then
      deny "$ABS_P is outside this option's allowed roots ($READ_ROOTS)"
    fi
  fi

  if [ "$TOOL" = "Write" ]; then
    ROOTS="${WRITE_ROOTS:-$READ_ROOTS}"
  else
    ROOTS="$READ_ROOTS"
  fi

  # Any absolute path mentioned must sit under one of the allowed roots (or the run's own output
  # dir), once normalized — an un-normalized "$KB_EXTRAS/.cache/../state/_shared.json" or
  # "$KB_EXTRAS/../../../../../../composer.json" would otherwise slip past the prefix check below.
  for p in $(printf '%s' "$PATHS" | tr ' "' '\n\n' | grep '^/' || true); do
    NP=$(normalize "$p")
    if ! in_roots "$NP" $ROOTS "$REPORTS"; then
      deny "$NP is outside this option's allowed roots ($ROOTS)"
    fi
  done
fi

exit 0
