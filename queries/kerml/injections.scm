([
  (line_note)
  (block_note)
  (regular_comment)
] @injection.content
  (#set! injection.language "comment"))

((textual_representation
  (string) @injection.language
  (regular_comment) @injection.content)
  (#offset! @injection.content 0 2 0 -2)
  (#gsub! @injection.language "^\"(.*)\"$" "%1"))
