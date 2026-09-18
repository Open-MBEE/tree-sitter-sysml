; Namespaces

(package name: (_) @name) @definition.module
(library_package name: (_) @name) @definition.module
(namespace name: (_) @name) @definition.module

; Types

(type name: (_) @name) @definition.class
(classifier name: (_) @name) @definition.class
(data_type name: (_) @name) @definition.class
(class name: (_) @name) @definition.class
(structure name: (_) @name) @definition.class
(association name: (_) @name) @definition.class
(association_structure name: (_) @name) @definition.class
(metaclass name: (_) @name) @definition.class
(interaction name: (_) @name) @definition.class

(behavior name: (_) @name) @definition.function
(function name: (_) @name) @definition.function
(predicate name: (_) @name) @definition.function

; Features

(feature name: (_) @name) @definition.field
(step name: (_) @name) @definition.method
(expression_feature name: (_) @name) @definition.method
(boolean_expression name: (_) @name) @definition.method
(invariant name: (_) @name) @definition.field
(connector name: (_) @name) @definition.field
(binding_connector name: (_) @name) @definition.field
(succession name: (_) @name) @definition.field
(flow name: (_) @name) @definition.field

; References

(typed_by type: (qualified_name) @name) @reference.class

(specializes (qualified_name) @name) @reference.class

(feature_typing (qualified_name) @name) @reference.class

(subclassification (qualified_name) @name) @reference.class

(invocation_expression function: (qualified_name) @name) @reference.call
