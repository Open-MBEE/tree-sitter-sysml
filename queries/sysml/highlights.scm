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

(metadata_usage
  type: (qualified_name) @attribute)

(alias_member
  name: (_) @module)

(import
  (qualified_name) @module)

; Namespaces and definitions

(package
  name: (_) @module)

(library_package
  name: (_) @module)

(namespace
  name: (_) @module)


(part_definition name: (_) @type)
(item_definition name: (_) @type)
(attribute_definition name: (_) @type)
(enumeration_definition name: (_) @type)
(occurrence_definition name: (_) @type)
(port_definition name: (_) @type)
(connection_definition name: (_) @type)
(interface_definition name: (_) @type)
(allocation_definition name: (_) @type)
(flow_definition name: (_) @type)
(metadata_definition name: (_) @type)
(extended_definition name: (_) @type)
(state_definition name: (_) @type)
(constraint_definition name: (_) @type)
(requirement_definition name: (_) @type)
(concern_definition name: (_) @type)
(case_definition name: (_) @type)
(analysis_case_definition name: (_) @type)
(verification_case_definition name: (_) @type)
(use_case_definition name: (_) @type)
(view_definition name: (_) @type)
(viewpoint_definition name: (_) @type)
(rendering_definition name: (_) @type)

(action_definition name: (_) @function)
(calculation_definition name: (_) @function)

(part_definition short_name: (_) @type)
(item_definition short_name: (_) @type)
(attribute_definition short_name: (_) @type)
(enumeration_definition short_name: (_) @type)
(occurrence_definition short_name: (_) @type)
(port_definition short_name: (_) @type)
(connection_definition short_name: (_) @type)
(interface_definition short_name: (_) @type)
(allocation_definition short_name: (_) @type)
(flow_definition short_name: (_) @type)
(metadata_definition short_name: (_) @type)
(extended_definition short_name: (_) @type)
(state_definition short_name: (_) @type)
(constraint_definition short_name: (_) @type)
(requirement_definition short_name: (_) @type)
(concern_definition short_name: (_) @type)
(case_definition short_name: (_) @type)
(analysis_case_definition short_name: (_) @type)
(verification_case_definition short_name: (_) @type)
(use_case_definition short_name: (_) @type)
(view_definition short_name: (_) @type)
(viewpoint_definition short_name: (_) @type)
(rendering_definition short_name: (_) @type)
(action_definition short_name: (_) @function)
(calculation_definition short_name: (_) @function)

; Usages

(action_usage name: (_) @function)
(calculation_usage name: (_) @function)
(perform_action_usage name: (_) @function.call)
(state_usage name: (_) @label)
(exhibit_state_usage name: (_) @label)
(transition_usage name: (_) @label)
(enumeration_usage name: (_) @constant)
(variant_member (_ name: (_) @constant))

; Type references

(typed_by type: (qualified_name) @type)

(typed_by type: (feature_chain (qualified_name) @type .))

(conjugated_port_reference (qualified_name) @type)

(specializes (qualified_name) @type)

(subsets (qualified_name) @variable.member)

(redefines (qualified_name) @variable.member)

(references (qualified_name) @variable.member)

(crosses (qualified_name) @variable.member)

(unions (qualified_name) @type)

(intersects (qualified_name) @type)

(differences (qualified_name) @type)

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
  "expose"
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
  "decide"
  "merge"
  "fork"
  "join"
] @keyword.conditional

[
  "loop"
  "while"
  "until"
] @keyword.repeat

[
  "return"
  "terminate"
  "done"
] @keyword.return

[
  "public"
  "private"
  "protected"
  "abstract"
  "derived"
  "variation"
  "variant"
  "individual"
  "constant"
  "const"
  "var"
  "ref"
  "composite"
  "portion"
  "end"
  "ordered"
  "nonunique"
  "in"
  "out"
  "inout"
  "default"
  "all"
  "parallel"
  "snapshot"
  "timeslice"
  "chain"
] @keyword.modifier

[
  "def"
  "part"
  "item"
  "attribute"
  "enum"
  "occurrence"
  "port"
  "connection"
  "interface"
  "allocation"
  "flow"
  "metadata"
  "state"
  "constraint"
  "requirement"
  "concern"
  "case"
  "analysis"
  "verification"
  "use"
  "view"
  "viewpoint"
  "rendering"
  "event"
  "message"
  "succession"
  "binding"
  "expr"
] @keyword.type

[
  "action"
  "calc"
  "perform"
] @keyword.function

[
  "about"
  "accept"
  "actor"
  "after"
  "allocate"
  "assert"
  "assign"
  "assume"
  "at"
  "bind"
  "by"
  "choice"
  "comment"
  "connect"
  "crosses"
  "deep"
  "defer"
  "defined"
  "dependency"
  "differences"
  "do"
  "doc"
  "entry"
  "exhibit"
  "exit"
  "filter"
  "first"
  "frame"
  "from"
  "history"
  "include"
  "intersects"
  "junction"
  "language"
  "locale"
  "new"
  "objective"
  "of"
  "redefines"
  "references"
  "render"
  "rep"
  "require"
  "satisfy"
  "send"
  "shallow"
  "specializes"
  "stakeholder"
  "subject"
  "subsets"
  "to"
  "transition"
  "typed"
  "unions"
  "verify"
  "via"
  "when"
] @keyword
