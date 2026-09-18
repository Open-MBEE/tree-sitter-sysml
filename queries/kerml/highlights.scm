; Comments and documentation

[
  (line_note)
  (block_note)
  (regular_comment)
] @comment @spell

(documentation (regular_comment) @comment.documentation)

(comment (regular_comment) @comment.documentation)

; Literals

(string) @string

(literal_integer) @number

(literal_real) @number.float

(literal_boolean) @boolean

(literal_infinity) @constant.builtin

(null_expression) @constant.builtin

; Names

(identifier) @variable

(unrestricted_name) @variable

(qualified_name
  (_) @module
  "::")

(qualified_name
  "$" @variable.builtin)

(prefix_metadata
  (qualified_name (_) @attribute .))

(metadata_feature
  type: (qualified_name (_) @attribute .))

(alias_member
  name: (_) @module)

(import
  (qualified_name (_) @module .))

; Namespaces and types

(package
  name: (_) @module)

(library_package
  name: (_) @module)

(namespace
  name: (_) @module)


(type name: (_) @type)
(classifier name: (_) @type)
(data_type name: (_) @type)
(class name: (_) @type)
(structure name: (_) @type)
(association name: (_) @type)
(association_structure name: (_) @type)
(metaclass name: (_) @type)
(interaction name: (_) @type)
(behavior name: (_) @function)
(function name: (_) @function)
(predicate name: (_) @function)

(type short_name: (_) @type)
(classifier short_name: (_) @type)
(data_type short_name: (_) @type)
(class short_name: (_) @type)
(structure short_name: (_) @type)
(association short_name: (_) @type)
(association_structure short_name: (_) @type)
(metaclass short_name: (_) @type)
(interaction short_name: (_) @type)
(behavior short_name: (_) @function)
(function short_name: (_) @function)
(predicate short_name: (_) @function)

; Features

(step name: (_) @function)
(expression_feature name: (_) @function)
(invariant name: (_) @label)

; Type references

(typed_by type: (qualified_name (_) @type .))

(typed_by type: (feature_chain (qualified_name (_) @type .) .))

(feature_typing (qualified_name (_) @type .))

(specializes (qualified_name (_) @type .))

(specialization (qualified_name (_) @type .))

(subclassification (qualified_name (_) @type .))

(conjugates (qualified_name (_) @type .))

(conjugation (qualified_name (_) @type .))

(subsets (qualified_name (_) @variable.member .))

(subsetting (qualified_name (_) @variable.member .))

(redefines (qualified_name (_) @variable.member .))

(redefinition (qualified_name (_) @variable.member .))

(references (qualified_name (_) @variable.member .))

(crosses (qualified_name (_) @variable.member .))

(chains (qualified_name (_) @variable.member .))

(inverse_of (qualified_name (_) @variable.member .))

(featured_by (qualified_name (_) @type .))

(unions (qualified_name (_) @type .))

(intersects (qualified_name (_) @type .))

(differences (qualified_name (_) @type .))

(disjoint_from (qualified_name (_) @type .))

(classification_expression type: (qualified_name (_) @type .))

(extent_expression type: (qualified_name (_) @type .))

; Expressions

(constructor_expression
  (qualified_name (_) @type .))

(named_argument
  name: (qualified_name (_) @variable.parameter .))

(feature_chain_expression
  feature: (qualified_name (_) @variable.member .))

(feature_chain
  (qualified_name (_) @variable.member .))

; Calls

(invocation_expression
  function: (qualified_name (_) @function.call .))

(invocation_expression
  function: (feature_chain_expression feature: (qualified_name (_) @function.call .)))

(arrow_expression
  function: (qualified_name (_) @function.call .))

; Operators

[
  "+"
  "-"
  "*"
  "/"
  "%"
  "**"
  "^"
  "=="
  "!="
  "==="
  "!=="
  "<"
  "<="
  ">"
  ">="
  "&"
  "|"
  "??"
  "="
  ":="
  ".."
  "->"
  ".?"
  "~"
  "=>"
  ":>"
  ":>>"
  "::>"
  "@"
  "@@"
  "#"
  "?"
] @operator

[
  "and"
  "or"
  "xor"
  "not"
  "implies"
  "istype"
  "hastype"
  "as"
  "meta"
] @keyword.operator

; Punctuation

[
  "("
  ")"
  "["
  "]"
  "{"
  "}"
] @punctuation.bracket

[
  ";"
  ","
  "."
  ":"
  "::"
  "::*"
  "::**"
] @punctuation.delimiter

; Keywords

[
  "import"
  "alias"
  "for"
] @keyword.import

[
  "package"
  "library"
  "namespace"
  "standard"
] @keyword.module

[
  "if"
  "else"
  "then"
] @keyword.conditional

[
  "return"
  "done"
] @keyword.return

[
  "public"
  "private"
  "protected"
  "abstract"
  "derived"
  "composite"
  "portion"
  "const"
  "var"
  "end"
  "ordered"
  "nonunique"
  "in"
  "out"
  "inout"
  "default"
  "all"
  "member"
  "chain"
] @keyword.modifier

[
  "type"
  "classifier"
  "datatype"
  "class"
  "struct"
  "assoc"
  "metaclass"
  "interaction"
  "feature"
  "connector"
  "binding"
  "succession"
  "flow"
  "multiplicity"
  "expr"
  "bool"
  "inv"
] @keyword.type

[
  "behavior"
  "function"
  "predicate"
  "step"
] @keyword.function

[
  "about"
  "by"
  "chains"
  "comment"
  "conjugate"
  "conjugates"
  "conjugation"
  "crosses"
  "defined"
  "dependency"
  "differences"
  "disjoining"
  "disjoint"
  "doc"
  "featured"
  "featuring"
  "filter"
  "first"
  "from"
  "intersects"
  "inverse"
  "inverting"
  "language"
  "locale"
  "metadata"
  "new"
  "of"
  "redefines"
  "redefinition"
  "references"
  "rep"
  "specialization"
  "specializes"
  "subclassifier"
  "subset"
  "subsets"
  "subtype"
  "to"
  "typed"
  "typing"
  "unions"
] @keyword
