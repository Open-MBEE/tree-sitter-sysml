#!/usr/bin/env bash
# Parse every .kerml/.sysml file under the given roots with the matching grammar.
# Usage: script/parse-coverage.sh [--list] <dir-or-file>...
#   --list  print each failing file with the location of its first error
# Roots default to $OPENSYSML_DIR/examples (OPENSYSML_DIR defaults to ../OpenSysML).
set -euo pipefail

cd "$(dirname "$0")/.."

TREE_SITTER=${TREE_SITTER:-./node_modules/.bin/tree-sitter}
BATCH=500

list=0
if [ "${1:-}" = "--list" ]; then
  list=1
  shift
fi

if [ $# -eq 0 ]; then
  set -- "${OPENSYSML_DIR:-../OpenSysML}/examples"
fi

status=0

report() {
  local ext="$1"
  shift
  local files=()
  while IFS= read -r -d '' f; do
    files+=("$f")
  done < <(find "$@" -type f -name "*.$ext" -print0 | sort -z)
  if [ ${#files[@]} -eq 0 ]; then
    echo "$ext: no files"
    return
  fi
  local total=0 ok=0 failed=0 i
  for ((i = 0; i < ${#files[@]}; i += BATCH)); do
    local out
    out=$("$TREE_SITTER" parse -q --stat --scope "source.$ext" "${files[@]:i:BATCH}" 2>&1) || true
    if [ "$list" -eq 1 ]; then
      printf '%s\n' "$out" | grep -E '\((ERROR|MISSING)' | sed -E 's/[[:space:]]+Parse:.*(\((ERROR|MISSING)[^)]*\)).*/  \1/' || true
    fi
    local summary
    summary=$(printf '%s\n' "$out" | grep -E '^Total parses:' || true)
    total=$((total + $(printf '%s' "$summary" | sed -E 's/.*Total parses: ([0-9]+).*/\1/')))
    ok=$((ok + $(printf '%s' "$summary" | sed -E 's/.*successful parses: ([0-9]+).*/\1/')))
    failed=$((failed + $(printf '%s' "$summary" | sed -E 's/.*failed parses: ([0-9]+).*/\1/')))
  done
  awk -v ext="$ext" -v total="$total" -v ok="$ok" -v failed="$failed" \
    'BEGIN { printf "== %s: %d files, %d parsed, %d failed (%.2f%%)\n", ext, total, ok, failed, 100 * ok / total }'
  [ "$failed" -eq 0 ] || status=1
}

report kerml "$@"
report sysml "$@"
exit "$status"
