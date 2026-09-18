#!/usr/bin/env bash
# Compile every query file of each grammar against its example file.
set -euo pipefail

cd "$(dirname "$0")/.."

TREE_SITTER=${TREE_SITTER:-./node_modules/.bin/tree-sitter}
status=0

for lang in kerml sysml; do
  for query in queries/"$lang"/*.scm; do
    if "$TREE_SITTER" query -q --scope "source.$lang" "$query" "examples/vehicle.$lang" >/dev/null; then
      echo "ok   $query"
    else
      echo "FAIL $query"
      status=1
    fi
  done
done

exit "$status"
