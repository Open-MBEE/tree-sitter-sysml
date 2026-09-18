; Classes: definitions and namespaces

[
  (package)
  (library_package)
  (namespace)
  (part_definition)
  (item_definition)
  (attribute_definition)
  (enumeration_definition)
  (occurrence_definition)
  (port_definition)
  (connection_definition)
  (interface_definition)
  (allocation_definition)
  (flow_definition)
  (metadata_definition)
  (extended_definition)
  (state_definition)
  (constraint_definition)
  (requirement_definition)
  (concern_definition)
  (case_definition)
  (analysis_case_definition)
  (verification_case_definition)
  (use_case_definition)
  (view_definition)
  (viewpoint_definition)
  (rendering_definition)
] @class.outer

(package body: (body . "{" . (_) @_start (_)? @_end . "}")
  (#make-range! "class.inner" @_start @_end))
(library_package body: (body . "{" . (_) @_start (_)? @_end . "}")
  (#make-range! "class.inner" @_start @_end))
(namespace body: (body . "{" . (_) @_start (_)? @_end . "}")
  (#make-range! "class.inner" @_start @_end))
(part_definition body: (body . "{" . (_) @_start (_)? @_end . "}")
  (#make-range! "class.inner" @_start @_end))
(item_definition body: (body . "{" . (_) @_start (_)? @_end . "}")
  (#make-range! "class.inner" @_start @_end))
(attribute_definition body: (body . "{" . (_) @_start (_)? @_end . "}")
  (#make-range! "class.inner" @_start @_end))
(enumeration_definition body: (body . "{" . (_) @_start (_)? @_end . "}")
  (#make-range! "class.inner" @_start @_end))
(occurrence_definition body: (body . "{" . (_) @_start (_)? @_end . "}")
  (#make-range! "class.inner" @_start @_end))
(port_definition body: (body . "{" . (_) @_start (_)? @_end . "}")
  (#make-range! "class.inner" @_start @_end))
(connection_definition body: (body . "{" . (_) @_start (_)? @_end . "}")
  (#make-range! "class.inner" @_start @_end))
(interface_definition body: (body . "{" . (_) @_start (_)? @_end . "}")
  (#make-range! "class.inner" @_start @_end))
(state_definition body: (body . "{" . (_) @_start (_)? @_end . "}")
  (#make-range! "class.inner" @_start @_end))
(constraint_definition body: (body . "{" . (_) @_start (_)? @_end . "}")
  (#make-range! "class.inner" @_start @_end))
(requirement_definition body: (body . "{" . (_) @_start (_)? @_end . "}")
  (#make-range! "class.inner" @_start @_end))

; Functions: actions, calculations, constraints

[
  (action_definition)
  (calculation_definition)
  (action_usage)
  (calculation_usage)
  (constraint_usage)
  (assert_constraint_usage)
  (requirement_constraint_usage)
  (perform_action_usage)
  (state_usage)
  (transition_usage)
] @function.outer

(action_definition body: (body . "{" . (_) @_start (_)? @_end . "}")
  (#make-range! "function.inner" @_start @_end))
(calculation_definition body: (body . "{" . (_) @_start (_)? @_end . "}")
  (#make-range! "function.inner" @_start @_end))
(action_usage body: (body . "{" . (_) @_start (_)? @_end . "}")
  (#make-range! "function.inner" @_start @_end))
(calculation_usage body: (body . "{" . (_) @_start (_)? @_end . "}")
  (#make-range! "function.inner" @_start @_end))
(constraint_usage body: (body . "{" . (_) @_start (_)? @_end . "}")
  (#make-range! "function.inner" @_start @_end))
(state_usage body: (body . "{" . (_) @_start (_)? @_end . "}")
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

(return_parameter) @parameter.outer

(subject_usage) @parameter.outer

(for_variable) @parameter.inner

; Calls

(invocation_expression) @call.outer

(invocation_expression
  (argument_list . "(" . (_) @_start (_)? @_end . ")")
  (#make-range! "call.inner" @_start @_end))

; Conditionals and loops

(if_node) @conditional.outer

(if_node
  condition: (_) @conditional.inner)

(conditional_expression) @conditional.outer

(conditional_expression
  condition: (_) @conditional.inner)

(while_loop_node) @loop.outer

(for_loop_node) @loop.outer

(while_loop_node
  (action_body_parameter (body . "{" . (_) @_start (_)? @_end . "}"))
  (#make-range! "loop.inner" @_start @_end))

(for_loop_node
  (action_body_parameter (body . "{" . (_) @_start (_)? @_end . "}"))
  (#make-range! "loop.inner" @_start @_end))

; Assignments

(value_part (expression) @assignment.rhs) @assignment.outer

(assignment_node
  target: (_) @assignment.lhs
  value: (_) @assignment.rhs) @assignment.outer

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
