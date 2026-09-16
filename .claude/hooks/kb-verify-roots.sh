#!/bin/sh
# Shared root derivation for the kb-verify hooks.
#
# A sourced library, not a registered hook: kb-factory-setup registers only
# kb-verify-scope-fence.sh and kb-verify-record-transcript.sh, and both source this.
#
# Same KB_* names and the same precedence as src/paths.ts, so there is exactly one vocabulary for
# "where the factory's roots are" across the TypeScript, the shell and the skills. An explicit
# KB_* value (written by kb-factory-setup) always wins; otherwise the factory is located by probing
# for its package.json, which is what lets this file survive a move of the factory directory
# without an edit. The probe list below keeps the older layouts working; extend it, never replace
# it, so an existing checkout keeps resolving.
#
# Callers must have $PROJECT set before sourcing.

KB_ROOT="${KB_FACTORY_ROOT:-}"
if [ -z "$KB_ROOT" ]; then
  if [ -f "$PROJECT/sw-ai-sdk/libs/sw-dev-kb-factory/package.json" ]; then
    KB_ROOT="$PROJECT/sw-ai-sdk/libs/sw-dev-kb-factory"          # vendored inside a host project
  elif [ -f "$PROJECT/.claude/extras/ShopwareDevKnowledgeBase/package.json" ]; then
    KB_ROOT="$PROJECT/.claude/extras/ShopwareDevKnowledgeBase"   # legacy layout
  elif [ -f "$PROJECT/sw-dev-kb-factory/package.json" ]; then
    KB_ROOT="$PROJECT/sw-dev-kb-factory"                         # checked out beside a host project
  else
    KB_ROOT="$PROJECT"                                            # standalone factory repository
  fi
fi

KB_SOURCES="${KB_SOURCES_ROOT:-$KB_ROOT/.sources}"
SHOPWARE="${KB_SHOPWARE_ROOT:-$KB_SOURCES/shopware}"
DOCS="${KB_DOCS_ROOT:-$KB_SOURCES/docs}"
WIKI="${KB_WIKI_ROOT:-$KB_ROOT/wiki}"
CACHE="${KB_CACHE_ROOT:-$KB_ROOT/ingest/platform/.cache}"
REPORTS="${KB_REPORTS_ROOT:-$KB_ROOT/.claude/skills/kb-factory-verify/reports}"

# The one root that is genuinely the HOST's and not the factory's: it is the consumer
# project's own wiki, so it stays anchored on $PROJECT rather than on the factory.
PROJECT_WIKI="${KB_PROJECT_WIKI:-$PROJECT/docs/project-wiki}"
