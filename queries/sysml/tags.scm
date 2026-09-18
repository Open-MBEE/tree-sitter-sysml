; Namespaces

(package name: (_) @name) @definition.module
(library_package name: (_) @name) @definition.module
(namespace name: (_) @name) @definition.module

; Definitions

(part_definition name: (_) @name) @definition.class
(item_definition name: (_) @name) @definition.class
(attribute_definition name: (_) @name) @definition.class
(enumeration_definition name: (_) @name) @definition.class
(occurrence_definition name: (_) @name) @definition.class
(port_definition name: (_) @name) @definition.class
(connection_definition name: (_) @name) @definition.class
(interface_definition name: (_) @name) @definition.class
(allocation_definition name: (_) @name) @definition.class
(flow_definition name: (_) @name) @definition.class
(metadata_definition name: (_) @name) @definition.class
(extended_definition name: (_) @name) @definition.class
(state_definition name: (_) @name) @definition.class
(constraint_definition name: (_) @name) @definition.class
(requirement_definition name: (_) @name) @definition.class
(concern_definition name: (_) @name) @definition.class
(case_definition name: (_) @name) @definition.class
(analysis_case_definition name: (_) @name) @definition.class
(verification_case_definition name: (_) @name) @definition.class
(use_case_definition name: (_) @name) @definition.class
(view_definition name: (_) @name) @definition.class
(viewpoint_definition name: (_) @name) @definition.class
(rendering_definition name: (_) @name) @definition.class

(action_definition name: (_) @name) @definition.function
(calculation_definition name: (_) @name) @definition.function

; Usages

(action_usage name: (_) @name) @definition.method
(calculation_usage name: (_) @name) @definition.method
(state_usage name: (_) @name) @definition.method

(part_usage name: (_) @name) @definition.field
(item_usage name: (_) @name) @definition.field
(attribute_usage name: (_) @name) @definition.field
(reference_usage name: (_) @name) @definition.field
(enumeration_usage name: (_) @name) @definition.constant
(port_usage name: (_) @name) @definition.field
(connection_usage name: (_) @name) @definition.field
(interface_usage name: (_) @name) @definition.field
(constraint_usage name: (_) @name) @definition.field
(requirement_usage name: (_) @name) @definition.field
(view_usage name: (_) @name) @definition.field

; References

(typed_by type: (qualified_name) @name) @reference.class

(specializes (qualified_name) @name) @reference.class

(invocation_expression function: (qualified_name) @name) @reference.call

(perform_action_usage (qualified_name) @name) @reference.call
