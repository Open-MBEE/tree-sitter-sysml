# Sourced by the scripts: locate the tree-sitter CLI and give it a throwaway
# config so grammars resolve from the grammar directory, not the user's setup.
TREE_SITTER=${TREE_SITTER:-$PWD/node_modules/.bin/tree-sitter}
TREE_SITTER_DIR=$(mktemp -d)
export TREE_SITTER TREE_SITTER_DIR
trap 'rm -rf "$TREE_SITTER_DIR"' EXIT
printf '{"parser-directories":["%s"]}\n' "$TREE_SITTER_DIR" > "$TREE_SITTER_DIR/config.json"
