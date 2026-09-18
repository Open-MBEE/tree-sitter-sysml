# tree-sitter-sysml

[Tree-sitter](https://tree-sitter.github.io/) grammars for the OMG textual
notations of [KerML](https://www.omg.org/spec/KerML) and
[SysML v2](https://www.omg.org/spec/SysML):

| Grammar | Directory | Scope          | File types | C symbol            |
| ------- | --------- | -------------- | ---------- | ------------------- |
| KerML   | `kerml/`  | `source.kerml` | `.kerml`   | `tree_sitter_kerml` |
| SysML   | `sysml/`  | `source.sysml` | `.sysml`   | `tree_sitter_sysml` |

Both grammars are produced from one shared definition,
`common/define-grammar.js`, parameterised by dialect: the KerML grammar
reserves only KerML keywords (`classifier`, `feature`, `behavior`, …), the
SysML grammar only SysML ones (`part`, `attribute`, `action`, …), so a word
that is a keyword in one notation stays an ordinary name in the other.

The grammars are maintained alongside [OpenSysML](https://github.com/Open-MBEE/OpenSysML),
whose `sysml-lsp` language server complements them with diagnostics,
completion and navigation. Tree-sitter gives editors syntax highlighting,
folding, indentation, textobjects and symbol tags without a running server.

## Queries

Each grammar ships the query files editors expect, under `queries/<lang>/`:

| File              | Purpose                                             | Consumers                     |
| ----------------- | --------------------------------------------------- | ----------------------------- |
| `highlights.scm`  | syntax highlighting                                 | Helix, Neovim, Zed, `tree-sitter highlight` |
| `injections.scm`  | comment injection, `rep language "…"` bodies        | Helix, Neovim, Zed            |
| `locals.scm`      | scopes, definitions and references                  | Helix, Neovim, Zed            |
| `tags.scm`        | symbol tags (`tree-sitter tags`, code navigation)   | GitHub-style navigation tools |
| `folds.scm`       | fold regions                                        | Neovim, Zed                   |
| `indents.scm`     | indentation                                         | Helix, Neovim                 |
| `textobjects.scm` | class/function/parameter/comment/… textobjects      | Helix, Neovim                 |

Capture names follow the tree-sitter and nvim-treesitter conventions
(`@keyword`, `@type`, `@function`, `@variable.member`, `@local.definition`,
`@function.inner`, …). Helix and Zed accept the same names; Neovim users get
them through nvim-treesitter.

## Editor setup

### Helix

Add to `languages.toml` (the `[[language-server]]` entry makes `sysml-lsp`
start for both file types; drop it if you only want highlighting):

```toml
[language-server.sysml-lsp]
command = "sysml-lsp"
args = ["--stdio"]

[[language]]
name = "sysml"
scope = "source.sysml"
injection-regex = "sysml"
file-types = ["sysml"]
comment-tokens = "//"
block-comment-tokens = { start = "/*", end = "*/" }
indent = { tab-width = 4, unit = "    " }
language-servers = ["sysml-lsp"]

[[grammar]]
name = "sysml"
source = { git = "https://github.com/Open-MBEE/tree-sitter-sysml", rev = "<commit>", subpath = "sysml" }

[[language]]
name = "kerml"
scope = "source.kerml"
injection-regex = "kerml"
file-types = ["kerml"]
comment-tokens = "//"
block-comment-tokens = { start = "/*", end = "*/" }
indent = { tab-width = 4, unit = "    " }
language-servers = ["sysml-lsp"]

[[grammar]]
name = "kerml"
source = { git = "https://github.com/Open-MBEE/tree-sitter-sysml", rev = "<commit>", subpath = "kerml" }
```

Then `hx --grammar fetch && hx --grammar build`, and copy `queries/sysml/`
and `queries/kerml/` to `~/.config/helix/runtime/queries/sysml/` and
`…/kerml/`.

### Neovim (nvim-treesitter)

```lua
local parsers = require("nvim-treesitter.parsers").get_parser_configs()
for _, lang in ipairs({ "kerml", "sysml" }) do
  parsers[lang] = {
    install_info = {
      url = "https://github.com/Open-MBEE/tree-sitter-sysml",
      files = { "src/parser.c" },
      location = lang,
      branch = "develop",
    },
    filetype = lang,
  }
end
vim.filetype.add({ extension = { sysml = "sysml", kerml = "kerml" } })
```

Then `:TSInstall sysml kerml` and copy `queries/<lang>/*.scm` into a
`queries/<lang>/` directory on your runtimepath.

### Zed

A Zed extension can point its `grammars.<name>.repository` at this repository
with `path = "sysml"` / `path = "kerml"`, and reuse the query files under
`languages/<name>/`.

## Development

Requires Node.js and a C compiler.

```sh
npm install                 # tree-sitter-cli
npm run generate            # regenerate kerml/src and sysml/src from the grammar
npm test                    # corpus tests in kerml/test and sysml/test
npm run check-queries       # compile every query file against examples/
npm run coverage            # parse an OpenSysML checkout (see below)
```

`common/define-grammar.js` is the only hand-written grammar source; the files
under `kerml/src/` and `sysml/src/` are generated and are committed so that
editors can build the parsers without Node.js. Regenerate them after every
grammar change and commit the result.

### Parse coverage against OpenSysML

`script/parse-coverage.sh` parses every `.kerml` and `.sysml` file below the
given roots with the grammar matching its extension and reports the totals;
`--list` also prints each failing file with its first error location. With no
arguments it parses `$OPENSYSML_DIR/examples` (`OPENSYSML_DIR` defaults to
`../OpenSysML`):

```sh
script/parse-coverage.sh                          # OpenSysML examples
script/parse-coverage.sh --list ../OpenSysML      # whole checkout, list failures
```

The OpenSysML checkout doubles as the regression corpus: its bundled standard
library, examples, conformance fixtures and parser testdata all parse without
errors. The files that still fail are the intentionally invalid inputs under
`cmd/pilot-reject/testdata/negative/`, generated conversion-error artifacts,
and a handful of fixtures written in the more lenient syntax OpenSysML's own
parser accepts (KerML keywords such as `connector` or `feature` in `.sysml`
files, prefixes such as `ordered` before the usage keyword). This grammar
follows the OMG notation rather than those extensions.

## Grammar sources

The rules follow the normative textual notation in the KerML and SysML v2
specifications, as encoded in the pilot implementation's `KerML.xtext`,
`KerMLExpressions.xtext` and `SysML.xtext` at the release OpenSysML pins.
Deviations are deliberate and limited to what a syntax tree needs:

- One `body` rule accepts every member kind in every body. Which members are
  legal where is a semantic question left to `sysml-lsp`; this keeps the
  parser small and error recovery local.
- Expression precedence is encoded with tree-sitter precedence levels rather
  than one rule per level, so a `1 + 2 * 3` is a nested `binary_expression`.
- Words that are keywords only in some positions (`typed`, `defined`,
  `chain`, `first`, `done`) remain valid identifiers elsewhere.

## License

Apache License 2.0; see [LICENSE](LICENSE).
