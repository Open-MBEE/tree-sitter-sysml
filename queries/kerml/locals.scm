; Scopes

[
  (source_file)
  (body)
  (body_expression)
] @local.scope

; Definitions

(package name: (_) @local.definition)
(library_package name: (_) @local.definition)
(namespace name: (_) @local.definition)
(alias_member name: (_) @local.definition)

(type name: (_) @local.definition)
(classifier name: (_) @local.definition)
(data_type name: (_) @local.definition)
(class name: (_) @local.definition)
(structure name: (_) @local.definition)
(association name: (_) @local.definition)
(association_structure name: (_) @local.definition)
(metaclass name: (_) @local.definition)
(interaction name: (_) @local.definition)
(behavior name: (_) @local.definition)
(function name: (_) @local.definition)
(predicate name: (_) @local.definition)

(feature name: (_) @local.definition)
(step name: (_) @local.definition)
(expression_feature name: (_) @local.definition)
(boolean_expression name: (_) @local.definition)
(invariant name: (_) @local.definition)
(connector name: (_) @local.definition)
(binding_connector name: (_) @local.definition)
(succession name: (_) @local.definition)
(flow name: (_) @local.definition)
(succession_flow name: (_) @local.definition)
(multiplicity name: (_) @local.definition)
(metadata_feature name: (_) @local.definition)

; References

(qualified_name [(identifier) (unrestricted_name)] @local.reference)
