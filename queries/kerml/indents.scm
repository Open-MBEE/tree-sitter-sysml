[
  (body)
  (body_expression)
  (argument_list)
  (sequence_expression)
  (multiplicity_range)
] @indent.begin

[
  "}"
  ")"
  "]"
] @indent.end

[
  "}"
  ")"
  "]"
] @indent.branch

[
  (regular_comment)
  (block_note)
  (string)
] @indent.auto

(ERROR "{") @indent.begin
