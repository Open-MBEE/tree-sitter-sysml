# Contributing

Branches follow git-flow: cut from `develop`, named `feature/…`, `fix/…`,
`docs/…` and so on, with pull requests against `develop`.

Before opening a pull request:

1. Edit `common/define-grammar.js` (never the generated `*/src/` files).
2. `npm run generate` and commit the regenerated `kerml/src/` and `sysml/src/`.
3. `npm test` — update or add corpus tests under `kerml/test/corpus/` and
   `sysml/test/corpus/`; `tree-sitter test --update` (run inside `kerml/` or
   `sysml/`) rewrites expected trees, so review the diff for `ERROR` and
   `MISSING` nodes before committing.
4. `npm run check-queries` after touching anything under `queries/`.
5. `script/parse-coverage.sh --list ../OpenSysML` against an OpenSysML
   checkout; a change must not regress the number of parsed files.

Keep grammar changes anchored to a production in the OMG grammars and cite it
in the pull request.
