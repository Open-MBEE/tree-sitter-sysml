; Classes: types and namespaces

[
  (package)
  (library_package)
  (namespace)
  (type)
  (classifier)
  (data_type)
  (class)
  (structure)
  (association)
  (association_structure)
  (metaclass)
  (interaction)
] @class.outer

(package body: (body . "{" . (_) @_start (_)? @_end . "}")
  (#make-range! "class.inner" @_start @_end))
(library_package body: (body . "{" . (_) @_start (_)? @_end . "}")
  (#make-range! "class.inner" @_start @_end))
(namespace body: (body . "{" . (_) @_start (_)? @_end . "}")
  (#make-range! "class.inner" @_start @_end))
(type body: (body . "{" . (_) @_start (_)? @_end . "}")
  (#make-range! "class.inner" @_start @_end))
(classifier body: (body . "{" . (_) @_start (_)? @_end . "}")
  (#make-range! "class.inner" @_start @_end))
(data_type body: (body . "{" . (_) @_start (_)? @_end . "}")
  (#make-range! "class.inner" @_start @_end))
(class body: (body . "{" . (_) @_start (_)? @_end . "}")
  (#make-range! "class.inner" @_start @_end))
(structure body: (body . "{" . (_) @_start (_)? @_end . "}")
  (#make-range! "class.inner" @_start @_end))
(association body: (body . "{" . (_) @_start (_)? @_end . "}")
  (#make-range! "class.inner" @_start @_end))
(association_structure body: (body . "{" . (_) @_start (_)? @_end . "}")
  (#make-range! "class.inner" @_start @_end))
(metaclass body: (body . "{" . (_) @_start (_)? @_end . "}")
  (#make-range! "class.inner" @_start @_end))
(interaction body: (body . "{" . (_) @_start (_)? @_end . "}")
  (#make-range! "class.inner" @_start @_end))

; Functions: behaviors, functions, predicates and their features

[
  (behavior)
  (function)
  (predicate)
  (step)
  (expression_feature)
  (boolean_expression)
  (invariant)
] @function.outer

(behavior body: (body . "{" . (_) @_start (_)? @_end . "}")
  (#make-range! "function.inner" @_start @_end))
(function body: (body . "{" . (_) @_start (_)? @_end . "}")
  (#make-range! "function.inner" @_start @_end))
(predicate body: (body . "{" . (_) @_start (_)? @_end . "}")
  (#make-range! "function.inner" @_start @_end))
(step body: (body . "{" . (_) @_start (_)? @_end . "}")
  (#make-range! "function.inner" @_start @_end))
(expression_feature body: (body . "{" . (_) @_start (_)? @_end . "}")
  (#make-range! "function.inner" @_start @_end))
(boolean_expression body: (body . "{" . (_) @_start (_)? @_end . "}")
  (#make-range! "function.inner" @_start @_end))
(invariant body: (body . "{" . (_) @_start (_)? @_end . "}")
  (#make-range! "function.inner" @_start @_end))

; Blocks

(body . "{" . (_) @_start (_)? @_end . "}"
  (#make-range! "block.inner" @_start @_end))

(body) @block.outer

; Parameters

(argument_list
  (_) @parameter.inner)

(argument_list
  "," @_start . (_) @parameter.inner
  (#make-range! "parameter.outer" @_start @parameter.inner))

(argument_list
  . (_) @parameter.inner . ","? @_end
  (#make-range! "parameter.outer" @parameter.inner @_end))

(return_member) @parameter.outer

; Calls

(invocation_expression) @call.outer

(invocation_expression
  (argument_list . "(" . (_) @_start (_)? @_end . ")")
  (#make-range! "call.inner" @_start @_end))

; Conditionals

(conditional_expression) @conditional.outer

(conditional_expression
  condition: (_) @conditional.inner)

; Assignments

(value_part (expression) @assignment.rhs) @assignment.outer

; Comments

[
  (line_note)
  (block_note)
  (regular_comment)
] @comment.outer

(documentation) @comment.outer

(comment) @comment.outer

; Numbers

[
  (literal_integer)
  (literal_real)
] @number.inner

; Statements

(body (_) @statement.outer)

(source_file (_) @statement.outer)
