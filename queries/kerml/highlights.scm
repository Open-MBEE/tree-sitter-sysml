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
  (identifier) @module
  "::")

(qualified_name
  "$" @variable.builtin)

(prefix_metadata
  (qualified_name) @attribute)

(metadata_feature
  type: (qualified_name) @attribute)

(alias_member
  name: (_) @module)

(import
  (qualified_name) @module)

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

(typed_by type: (qualified_name) @type)

(typed_by type: (feature_chain (qualified_name) @type .))

(feature_typing (qualified_name) @type)

(specializes (qualified_name) @type)

(specialization (qualified_name) @type)

(subclassification (qualified_name) @type)

(conjugates (qualified_name) @type)

(conjugation (qualified_name) @type)

(subsets (qualified_name) @variable.member)

(subsetting (qualified_name) @variable.member)

(redefines (qualified_name) @variable.member)

(redefinition (qualified_name) @variable.member)

(references (qualified_name) @variable.member)

(crosses (qualified_name) @variable.member)

(chains (qualified_name) @variable.member)

(inverse_of (qualified_name) @variable.member)

(featured_by (qualified_name) @type)

(unions (qualified_name) @type)

(intersects (qualified_name) @type)

(differences (qualified_name) @type)

(disjoint_from (qualified_name) @type)

(classification_expression type: (qualified_name) @type)

(extent_expression type: (qualified_name) @type)

; Expressions

(invocation_expression
  function: (qualified_name (identifier) @function.call .))

(invocation_expression
  function: (feature_chain_expression feature: (qualified_name (identifier) @function.call .)))

(arrow_expression
  function: (qualified_name (identifier) @function.call .))

(constructor_expression
  (qualified_name) @type)

(named_argument
  name: (qualified_name) @variable.parameter)

(feature_chain_expression
  feature: (qualified_name (identifier) @variable.member .))

(feature_chain
  (qualified_name (identifier) @variable.member .))

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
