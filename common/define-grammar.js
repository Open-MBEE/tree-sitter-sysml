/**
 * Shared grammar definition for KerML and SysML v2.
 *
 * The rules follow the OMG textual notation (KerML.xtext, KerMLExpressions.xtext
 * and SysML.xtext of the SysML v2 pilot implementation). Bodies are unified: one
 * `body` rule accepts every member kind, so the parser is more permissive than a
 * semantic checker; OpenSysML's `sysml-lsp` reports what the grammar lets through.
 *
 * @param {'kerml' | 'sysml'} dialect
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const PREC = {
  conditional: 1,
  null_coalescing: 2,
  implies: 3,
  or: 4,
  xor: 5,
  and: 6,
  equality: 7,
  classification: 8,
  relational: 9,
  range: 10,
  additive: 11,
  multiplicative: 12,
  exponential: 13,
  unary: 14,
  extent: 15,
  postfix: 16,
  call: 17,
};

/**
 * @param {RuleOrLiteral} rule
 */
function commaSep1(rule) {
  return seq(rule, repeat(seq(',', rule)));
}

/**
 * @param {RuleOrLiteral} rule
 */
function commaSep2(rule) {
  return seq(rule, repeat1(seq(',', rule)));
}

/**
 * A sequence of optional rules that must match at least one of them.
 *
 * @param {RuleOrLiteral[]} rules
 */
function optionalSeq(...rules) {
  return choice(...rules.map((rule, i) => seq(rule, ...rules.slice(i + 1).map(r => optional(r)))));
}

module.exports = function defineGrammar(dialect) {
  const sysml = dialect === 'sysml';
  const kerml = dialect === 'kerml';

  return grammar({
    name: dialect,

    word: $ => $.identifier,

    extras: $ => [
      /\s/,
      $.line_note,
      $.block_note,
      $.regular_comment,
    ],

    supertypes: $ => [
      $.expression,
      $._literal,
    ],

    conflicts: $ => [
      [$._modifier],
      [$._contextual_keyword, $._declaration],
      [$._type_reference, $._metadata_declaration],
      [$._identification],
      [$._declaration, $.connector_end],
      [$._declaration],
      [$._identification, $.connector_end],
      [$._identification, $.qualified_name],
      ...(kerml ? [
        [$._type_reference, $.expression],
        [$._contextual_keyword, $.succession],
      ] : []),
      ...(sysml ? [
        [$.if_node],
        [$._performed_action],
        [$._contextual_keyword, $.transition_usage],
        [$._contextual_keyword, $.final_node],
        [$._contextual_keyword, $.succession_as_usage],
        [$._contextual_keyword, $.succession_as_usage, $.initial_node_member],
        [$._contextual_keyword, $._typed_by_keyword],
        [$.empty_succession, $.target_succession],
        [$.connector_end, $.empty_succession],
        [$.payload, $.payload_parameter],
      ] : []),
    ],

    rules: {
      source_file: $ => repeat($._body_item),

      // ---------------------------------------------------------------
      // Lexical
      // ---------------------------------------------------------------

      identifier: _ => /[A-Za-z_][A-Za-z0-9_]*/,

      unrestricted_name: _ => /'([^'\\]|\\.)*'/,

      _name: $ => choice($.identifier, $.unrestricted_name, alias($._contextual_keyword, $.identifier)),

      _contextual_keyword: _ => choice('typed', 'defined', 'chain', 'first', 'done'),

      line_note: _ => token(seq('//', optional(seq(/[^*\n]/, /[^\n]*/)))),

      block_note: _ => token(seq('//*', /[^*]*\*+([^/*][^*]*\*+)*/, '/')),

      regular_comment: _ => token(seq('/*', /[^*]*\*+([^/*][^*]*\*+)*/, '/')),

      string: _ => /"([^"\\]|\\.)*"/,

      // ---------------------------------------------------------------
      // Names
      // ---------------------------------------------------------------

      qualified_name: $ => seq(
        optional(seq('$', '::')),
        repeat(seq($._name, '::')),
        $._name,
      ),

      feature_chain: $ => prec(1, seq($.qualified_name, repeat1(seq('.', $.qualified_name)))),

      _type_reference: $ => choice($.qualified_name, $.feature_chain),

      _identification: $ => choice(
        seq('<', field('short_name', $._name), '>', optional(field('name', $._name))),
        field('name', $._name),
      ),

      visibility: _ => choice('public', 'private', 'protected'),

      // ---------------------------------------------------------------
      // Bodies
      // ---------------------------------------------------------------

      body: $ => seq('{', repeat(choice($._body_item, $.result_expression_member)), '}'),

      result_expression_member: $ => prec.dynamic(-1, seq($.expression, optional(';'))),

      _body_or_semicolon: $ => choice(';', field('body', $.body)),

      _state_body_or_semicolon: $ => choice(';', seq(optional('parallel'), field('body', $.body))),

      _body_item: $ => seq(
        optional($.visibility),
        ...(kerml ? [optional('member')] : []),
        choice(
          $._annotating_element,
          $._namespace_element,
          $.alias_member,
          $.import,
          $.element_filter_member,
          ...(sysml ? [
            $._definition_element,
            $._usage_element,
            seq($.empty_succession, optional($.visibility), $._usage_element),
            $.variant_member,
            $.return_parameter,
            $.subject_usage,
            $.actor_usage,
            $.stakeholder_usage,
            $.requirement_constraint_usage,
            $.framed_concern_usage,
            $.requirement_verification_usage,
            $.objective_requirement_usage,
            $.view_rendering_usage,
            $.expose,
            $.initial_node_member,
            $.target_succession,
            $.target_transition,
            $.default_target_succession,
            $.transition_usage,
            $.state_subaction,
            $.final_node,
            $.pseudostate,
            $.defer_member,
          ] : []),
          ...(kerml ? [
            $._type_element,
            $._feature_element,
            $._relationship_element,
            $.return_member,
          ] : []),
        ),
      ),

      // ---------------------------------------------------------------
      // Annotating elements
      // ---------------------------------------------------------------

      _annotating_element: $ => choice(
        $.comment,
        $.documentation,
        $.textual_representation,
        sysml ? $.metadata_usage : $.metadata_feature,
      ),

      comment: $ => seq(
        optional(seq(
          'comment',
          optional($._identification),
          optional(seq('about', commaSep1($.qualified_name))),
        )),
        optional(seq('locale', $.string)),
        $.regular_comment,
      ),

      documentation: $ => seq(
        'doc',
        optional($._identification),
        optional(seq('locale', $.string)),
        $.regular_comment,
      ),

      textual_representation: $ => seq(
        optional(seq('rep', optional($._identification))),
        'language',
        $.string,
        $.regular_comment,
      ),

      prefix_metadata: $ => seq('#', $.qualified_name),

      _metadata_declaration: $ => seq(
        choice('@', 'metadata'),
        optional(seq(optional($._identification), $._typed_by_keyword)),
        field('type', $.qualified_name),
        optional(seq('about', commaSep1($.qualified_name))),
        $._body_or_semicolon,
      ),

      metadata_usage: $ => seq(optional($._prefix), $._metadata_declaration),

      metadata_feature: $ => seq(optional($._prefix), $._metadata_declaration),

      // ---------------------------------------------------------------
      // Namespaces, packages, imports
      // ---------------------------------------------------------------

      _namespace_element: $ => choice(
        $.package,
        $.library_package,
        $.dependency,
        $.namespace,
      ),

      package: $ => seq(
        optional($._prefix),
        'package',
        optional($._identification),
        $._body_or_semicolon,
      ),

      library_package: $ => seq(
        optional('standard'),
        'library',
        repeat($.prefix_metadata),
        'package',
        optional($._identification),
        $._body_or_semicolon,
      ),

      namespace: $ => seq(
        optional($._prefix),
        'namespace',
        optional($._identification),
        $._body_or_semicolon,
      ),

      dependency: $ => seq(
        optional($._prefix),
        'dependency',
        optional(seq(optional($._identification), 'from')),
        field('client', commaSep1($.qualified_name)),
        'to',
        field('supplier', commaSep1($.qualified_name)),
        $._body_or_semicolon,
      ),

      alias_member: $ => seq(
        'alias',
        optional(seq('<', field('short_name', $._name), '>')),
        optional(field('name', $._name)),
        'for',
        field('target', $.qualified_name),
        $._body_or_semicolon,
      ),

      import: $ => seq(
        'import',
        optional('all'),
        $._import_target,
        $._body_or_semicolon,
      ),

      _import_target: $ => seq(
        $.qualified_name,
        optional('::*'),
        optional('::**'),
        repeat($.filter_package_member),
      ),

      filter_package_member: $ => seq('[', $.expression, ']'),

      element_filter_member: $ => seq('filter', $.expression, ';'),

      // ---------------------------------------------------------------
      // Prefixes and declarations
      // ---------------------------------------------------------------

      _prefix: $ => repeat1($._modifier),

      _modifier: $ => choice(
        'in', 'out', 'inout',
        'derived', 'abstract',
        seq('end', optional($.cross_feature)),
        $.prefix_metadata,
        ...(sysml ? ['variation', 'constant', 'ref', 'individual', 'snapshot', 'timeslice'] : []),
        'composite', 'portion', 'var', 'const',
      ),

      cross_feature: $ => prec.dynamic(-1, seq(optional($._prefix), $._declaration)),

      _declaration: $ => seq(
        ...(kerml ? [optional('all')] : []),
        optional(prec.dynamic(-1, 'chain')),
        choice(
          seq($._identification, optional($._feature_specialization_part)),
          $._feature_specialization_part,
        ),
      ),

      _feature_specialization_part: $ => repeat1(choice(
        $.typed_by,
        $.subsets,
        $.references,
        $.crosses,
        $.redefines,
        $.multiplicity_range,
        'ordered',
        'nonunique',
        ...(kerml ? [
          $.conjugates,
          $.chains,
          $.inverse_of,
          $.featured_by,
          $.disjoint_from,
          $.unions,
          $.intersects,
          $.differences,
        ] : []),
      )),

      _typed_by_keyword: _ => choice(':', seq('typed', 'by'), seq('defined', 'by')),

      typed_by: $ => seq($._typed_by_keyword, commaSep1(field('type', $._feature_type))),

      _feature_type: $ => choice(
        $.qualified_name,
        $.feature_chain,
        ...(sysml ? [$.conjugated_port_reference] : []),
      ),

      conjugated_port_reference: $ => seq('~', $._type_reference),

      subsets: $ => seq(choice(':>', 'subsets', 'specializes'), commaSep1($._type_reference)),

      references: $ => seq(choice('::>', 'references'), $._type_reference),

      crosses: $ => seq(choice('=>', 'crosses'), $._type_reference),

      redefines: $ => seq(choice(':>>', 'redefines'), commaSep1($._type_reference)),

      specializes: $ => seq(choice(':>', 'specializes'), commaSep1($._type_reference)),

      conjugates: $ => seq(choice('~', 'conjugates'), $._type_reference),

      chains: $ => seq('chains', $._type_reference),

      inverse_of: $ => seq('inverse', 'of', $._type_reference),

      featured_by: $ => seq('featured', 'by', commaSep1($._type_reference)),

      disjoint_from: $ => seq('disjoint', 'from', commaSep1($._type_reference)),

      unions: $ => seq('unions', commaSep1($._type_reference)),

      intersects: $ => seq('intersects', commaSep1($._type_reference)),

      differences: $ => seq('differences', commaSep1($._type_reference)),

      multiplicity_range: $ => seq(
        '[',
        field('lower', $._multiplicity_bound),
        optional(prec.dynamic(1, seq('..', field('upper', $._multiplicity_bound)))),
        ']',
      ),

      _multiplicity_bound: $ => $.expression,

      value_part: $ => seq(
        choice('=', ':=', seq('default', optional(choice('=', ':=')))),
        $.expression,
      ),

      // ---------------------------------------------------------------
      // Connectors, flows, payloads
      // ---------------------------------------------------------------

      connector_end: $ => seq(
        optional($.multiplicity_range),
        optional(seq(field('name', $._name), choice('::>', 'references'))),
        $._type_reference,
      ),

      _connector_part: $ => choice(
        seq(field('source', $.connector_end), 'to', field('target', $.connector_end)),
        seq('(', commaSep2(field('end', $.connector_end)), ')'),
      ),

      _flow_declaration: $ => choice(
        seq($._declaration, optional($.value_part), optional($._flow_payload), optional($._flow_ends)),
        seq($.value_part, optional($._flow_payload), optional($._flow_ends)),
        seq($._flow_payload, optional($._flow_ends)),
        $._flow_ends,
        seq(
          ...(kerml ? [optional('all')] : []),
          field('source', $._type_reference), 'to', field('target', $._type_reference),
        ),
      ),

      _flow_payload: $ => seq('of', $.payload),

      _flow_ends: $ => seq('from', field('source', $._type_reference), 'to', field('target', $._type_reference)),

      payload: $ => choice(
        seq($._identification, $._feature_specialization_part, optional($.value_part)),
        seq(optional($._identification), $.value_part),
        field('type', $.qualified_name),
        seq($.multiplicity_range, field('type', $.qualified_name)),
      ),

      // ---------------------------------------------------------------
      // Expressions
      // ---------------------------------------------------------------

      expression: $ => choice(
        $.conditional_expression,
        $.binary_expression,
        $.unary_expression,
        $.classification_expression,
        $.extent_expression,
        $.feature_chain_expression,
        $.metadata_access_expression,
        $.index_expression,
        $.arrow_expression,
        $.collect_expression,
        $.select_expression,
        $.invocation_expression,
        $.constructor_expression,
        prec(-1, alias($.body, $.body_expression)),
        $.sequence_expression,
        $.null_expression,
        $._literal,
        $.qualified_name,
      ),

      conditional_expression: $ => prec.right(PREC.conditional, seq(
        'if',
        field('condition', $.expression),
        '?',
        field('consequence', $.expression),
        'else',
        field('alternative', $.expression),
      )),

      binary_expression: $ => choice(
        ...[
          ['??', PREC.null_coalescing, prec.left],
          ['implies', PREC.implies, prec.left],
          ['|', PREC.or, prec.left],
          ['or', PREC.or, prec.left],
          ['xor', PREC.xor, prec.left],
          ['&', PREC.and, prec.left],
          ['and', PREC.and, prec.left],
          ['==', PREC.equality, prec.left],
          ['!=', PREC.equality, prec.left],
          ['===', PREC.equality, prec.left],
          ['!==', PREC.equality, prec.left],
          ['<', PREC.relational, prec.left],
          ['>', PREC.relational, prec.left],
          ['<=', PREC.relational, prec.left],
          ['>=', PREC.relational, prec.left],
          ['..', PREC.range, prec.left],
          ['+', PREC.additive, prec.left],
          ['-', PREC.additive, prec.left],
          ['*', PREC.multiplicative, prec.left],
          ['/', PREC.multiplicative, prec.left],
          ['%', PREC.multiplicative, prec.left],
          ['**', PREC.exponential, prec.right],
          ['^', PREC.exponential, prec.right],
        ].map(([operator, precedence, assoc]) => assoc(precedence, seq(
          field('left', $.expression),
          // @ts-ignore
          field('operator', operator),
          field('right', $.expression),
        ))),
      ),

      unary_expression: $ => prec(PREC.unary, seq(
        field('operator', choice('+', '-', '~', 'not')),
        field('operand', $.expression),
      )),

      classification_expression: $ => choice(
        prec.left(PREC.classification, seq(
          field('operand', $.expression),
          field('operator', choice('hastype', 'istype', '@', 'as', '@@', 'meta')),
          field('type', $._type_reference),
        )),
        prec(PREC.classification, seq(
          field('operator', choice('hastype', 'istype', '@', 'as', '@@', 'meta')),
          field('type', $._type_reference),
        )),
      ),

      extent_expression: $ => prec(PREC.extent, seq('all', field('type', $._type_reference))),

      feature_chain_expression: $ => prec.left(PREC.postfix, seq(
        field('operand', $.expression),
        '.',
        field('feature', $.qualified_name),
      )),

      metadata_access_expression: $ => prec.left(PREC.postfix, seq(
        field('operand', $.expression),
        '.',
        'metadata',
      )),

      index_expression: $ => prec.left(PREC.postfix, seq(
        field('operand', $.expression),
        choice(
          seq('#', '(', field('index', $._sequence), ')'),
          seq('[', field('index', $._sequence), ']'),
        ),
      )),

      arrow_expression: $ => prec.left(PREC.postfix, seq(
        field('operand', $.expression),
        '->',
        field('function', $._type_reference),
        choice(
          alias($.body, $.body_expression),
          field('argument', $.qualified_name),
          $.argument_list,
        ),
      )),

      collect_expression: $ => prec.left(PREC.postfix, seq(
        field('operand', $.expression),
        '.',
        alias($.body, $.body_expression),
      )),

      select_expression: $ => prec.left(PREC.postfix, seq(
        field('operand', $.expression),
        '.?',
        alias($.body, $.body_expression),
      )),

      invocation_expression: $ => prec.left(PREC.call, seq(
        field('function', $.expression),
        $.argument_list,
      )),

      constructor_expression: $ => seq(
        'new',
        field('type', $._type_reference),
        $.argument_list,
      ),

      argument_list: $ => seq(
        '(',
        optional(choice(
          commaSep1($.expression),
          commaSep1($.named_argument),
        )),
        ')',
      ),

      named_argument: $ => seq(field('name', $.qualified_name), '=', field('value', $.expression)),

      sequence_expression: $ => seq('(', commaSep1($.expression), optional(','), ')'),

      _sequence: $ => seq(commaSep1($.expression), optional(',')),

      null_expression: _ => choice('null', seq('(', ')')),

      _literal: $ => choice(
        $.literal_boolean,
        $.literal_string,
        $.literal_integer,
        $.literal_real,
        $.literal_infinity,
      ),

      literal_boolean: _ => choice('true', 'false'),

      literal_string: $ => $.string,

      literal_integer: _ => /[0-9]+/,

      literal_real: _ => token(choice(
        /[0-9]*\.[0-9]+([eE][+-]?[0-9]+)?/,
        /[0-9]+[eE][+-]?[0-9]+/,
      )),

      literal_infinity: _ => '*',

      // ---------------------------------------------------------------
      // SysML definitions
      // ---------------------------------------------------------------

      ...(sysml ? sysmlRules() : {}),

      // ---------------------------------------------------------------
      // KerML types, features and relationships
      // ---------------------------------------------------------------

      ...(kerml ? kermlRules() : {}),
    },
  });
};

/**
 * SysML-only rules: definitions, usages, action and state notation.
 */
function sysmlRules() {
  /**
   * @param {RuleOrLiteral} keyword
   * @param {(($: GrammarSymbols<string>) => RuleOrLiteral) | undefined} bodyRule
   */
  const definition = (keyword, bodyRule) => $ => seq(
    optional($._prefix),
    keyword,
    'def',
    optional($._identification),
    optional($.specializes),
    repeat(choice($.unions, $.intersects, $.differences)),
    bodyRule ? bodyRule($) : $._body_or_semicolon,
  );

  /**
   * @param {RuleOrLiteral} keyword
   * @param {(($: GrammarSymbols<string>) => RuleOrLiteral) | undefined} bodyRule
   */
  const usage = (keyword, bodyRule) => $ => seq(
    optional($._prefix),
    keyword,
    optional($._declaration),
    optional($.value_part),
    bodyRule ? bodyRule($) : $._body_or_semicolon,
  );

  const stateBody = $ => $._state_body_or_semicolon;

  /**
   * @param {RuleOrLiteral} keyword
   */
  const memberReferenceOrDeclaration = keyword => $ => choice(
    seq($._type_reference, optional($._feature_specialization_part)),
    seq(repeat($.prefix_metadata), keyword, optional($._declaration), optional($.value_part)),
    seq(repeat1($.prefix_metadata), optional($._declaration), optional($.value_part)),
  );

  return {
    _definition_element: $ => choice(
      $.attribute_definition,
      $.enumeration_definition,
      $.occurrence_definition,
      $.item_definition,
      $.metadata_definition,
      $.part_definition,
      $.connection_definition,
      $.flow_definition,
      $.interface_definition,
      $.allocation_definition,
      $.port_definition,
      $.action_definition,
      $.calculation_definition,
      $.state_definition,
      $.constraint_definition,
      $.requirement_definition,
      $.concern_definition,
      $.case_definition,
      $.analysis_case_definition,
      $.verification_case_definition,
      $.use_case_definition,
      $.view_definition,
      $.viewpoint_definition,
      $.rendering_definition,
      $.extended_definition,
    ),

    attribute_definition: definition('attribute'),
    enumeration_definition: definition('enum'),
    occurrence_definition: definition('occurrence'),
    item_definition: definition('item'),
    metadata_definition: definition('metadata'),
    part_definition: definition('part'),
    connection_definition: definition('connection'),
    flow_definition: definition('flow'),
    interface_definition: definition('interface'),
    allocation_definition: definition('allocation'),
    port_definition: definition('port'),
    action_definition: definition('action'),
    calculation_definition: definition('calc'),
    state_definition: definition('state', stateBody),
    constraint_definition: definition('constraint'),
    requirement_definition: definition('requirement'),
    concern_definition: definition('concern'),
    case_definition: definition('case'),
    analysis_case_definition: definition('analysis'),
    verification_case_definition: definition('verification'),
    use_case_definition: definition(seq('use', 'case')),
    view_definition: definition('view'),
    viewpoint_definition: definition('viewpoint'),
    rendering_definition: definition('rendering'),

    extended_definition: $ => seq(
      $._prefix,
      'def',
      optional($._identification),
      optional($.specializes),
      $._body_or_semicolon,
    ),

    // ---------------------------------------------------------------
    // SysML usages
    // ---------------------------------------------------------------

    _usage_element: $ => choice(
      $.reference_usage,
      $._occurrence_usage_element,
      $.attribute_usage,
      $.expression_usage,
      $.enumeration_usage,
      $.binding_connector_as_usage,
      $.succession_as_usage,
    ),

    _occurrence_usage_element: $ => choice(
      $.occurrence_usage,
      $.event_occurrence_usage,
      $.item_usage,
      $.part_usage,
      $.view_usage,
      $.rendering_usage,
      $.port_usage,
      $.connection_usage,
      $.interface_usage,
      $.allocation_usage,
      $.message,
      $.flow_usage,
      $.succession_flow_usage,
      $.action_usage,
      $.calculation_usage,
      $.state_usage,
      $.constraint_usage,
      $.requirement_usage,
      $.concern_usage,
      $.case_usage,
      $.analysis_case_usage,
      $.verification_case_usage,
      $.use_case_usage,
      $.viewpoint_usage,
      $.perform_action_usage,
      $.exhibit_state_usage,
      $.include_use_case_usage,
      $.assert_constraint_usage,
      $.satisfy_requirement_usage,
      $._action_node,
    ),

    reference_usage: $ => seq(
      optionalSeq($._prefix, $._declaration, $.value_part),
      $._body_or_semicolon,
    ),

    attribute_usage: usage('attribute'),
    expression_usage: usage('expr'),
    enumeration_usage: usage('enum'),
    occurrence_usage: usage('occurrence'),
    item_usage: usage('item'),
    part_usage: usage('part'),
    port_usage: usage('port'),
    view_usage: usage('view'),
    rendering_usage: usage('rendering'),
    viewpoint_usage: usage('viewpoint'),
    action_usage: usage('action'),
    calculation_usage: usage('calc'),
    state_usage: usage('state', stateBody),
    constraint_usage: usage('constraint'),
    requirement_usage: usage('requirement'),
    concern_usage: usage('concern'),
    case_usage: usage('case'),
    analysis_case_usage: usage('analysis'),
    verification_case_usage: usage('verification'),
    use_case_usage: usage(seq('use', 'case')),

    event_occurrence_usage: $ => seq(
      optional($._prefix),
      'event',
      choice(
        seq($._type_reference, optional($._feature_specialization_part)),
        seq('occurrence', optional($._declaration)),
      ),
      optional($.value_part),
      $._body_or_semicolon,
    ),

    connection_usage: $ => seq(
      optional($._prefix),
      choice(
        seq('connection', optional($._declaration), optional($.value_part), optional(seq('connect', $._connector_part))),
        seq('connect', $._connector_part),
      ),
      $._body_or_semicolon,
    ),

    interface_usage: $ => seq(
      optional($._prefix),
      'interface',
      choice(
        seq(optional($._declaration), optional($.value_part), optional(seq('connect', $._connector_part))),
        $._connector_part,
      ),
      $._body_or_semicolon,
    ),

    allocation_usage: $ => seq(
      optional($._prefix),
      choice(
        seq('allocation', optional($._declaration), optional($.value_part), optional(seq('allocate', $._connector_part))),
        seq('allocate', $._connector_part),
      ),
      $._body_or_semicolon,
    ),

    binding_connector_as_usage: $ => seq(
      optional($._prefix),
      optional(seq('binding', optional($._declaration))),
      'bind',
      field('source', $.connector_end),
      '=',
      field('target', $.connector_end),
      $._body_or_semicolon,
    ),

    succession_as_usage: $ => seq(
      optional($._prefix),
      choice(
        seq('succession', optional($._declaration), optional('first')),
        'first',
      ),
      field('source', $.connector_end),
      optional($.guard),
      'then',
      field('target', $.connector_end),
      $._body_or_semicolon,
    ),

    message: $ => seq(
      optional($._prefix),
      'message',
      optional($._flow_declaration),
      $._body_or_semicolon,
    ),

    flow_usage: $ => seq(
      optional($._prefix),
      'flow',
      optional($._flow_declaration),
      $._body_or_semicolon,
    ),

    succession_flow_usage: $ => seq(
      optional($._prefix),
      'succession', 'flow',
      optional($._flow_declaration),
      $._body_or_semicolon,
    ),

    perform_action_usage: $ => seq(
      optional($._prefix),
      'perform',
      $._performed_action_reference,
      optional($.value_part),
      $._body_or_semicolon,
    ),

    exhibit_state_usage: $ => seq(
      optional($._prefix),
      'exhibit',
      choice(
        seq($._type_reference, optional($._feature_specialization_part)),
        seq('state', optional($._declaration)),
      ),
      optional($.value_part),
      $._state_body_or_semicolon,
    ),

    include_use_case_usage: $ => seq(
      optional($._prefix),
      'include',
      choice(
        seq($._type_reference, optional($._feature_specialization_part)),
        seq('use', 'case', optional($._declaration)),
      ),
      optional($.value_part),
      $._body_or_semicolon,
    ),

    assert_constraint_usage: $ => seq(
      optional($._prefix),
      'assert',
      optional('not'),
      choice(
        seq($._type_reference, optional($._feature_specialization_part)),
        seq('constraint', optional($._declaration), optional($.value_part)),
      ),
      $._body_or_semicolon,
    ),

    satisfy_requirement_usage: $ => seq(
      optional($._prefix),
      optional('assert'),
      optional('not'),
      'satisfy',
      choice(
        seq($._type_reference, optional($._feature_specialization_part)),
        seq('requirement', optional($._declaration)),
      ),
      optional($.value_part),
      optional(seq('by', field('subject', $._type_reference))),
      $._body_or_semicolon,
    ),

    // ---------------------------------------------------------------
    // Requirement, case and view members
    // ---------------------------------------------------------------

    variant_member: $ => seq('variant', $._usage_element),

    return_parameter: $ => seq('return', $._usage_element),

    subject_usage: $ => seq('subject', repeat($.prefix_metadata), optional($._declaration), optional($.value_part), $._body_or_semicolon),

    actor_usage: $ => seq('actor', repeat($.prefix_metadata), optional($._declaration), optional($.value_part), $._body_or_semicolon),

    stakeholder_usage: $ => seq('stakeholder', repeat($.prefix_metadata), optional($._declaration), optional($.value_part), $._body_or_semicolon),

    requirement_constraint_usage: $ => seq(
      field('kind', choice('assume', 'require')),
      $._constraint_reference_or_declaration,
      $._body_or_semicolon,
    ),

    framed_concern_usage: $ => seq(
      'frame',
      $._concern_reference_or_declaration,
      $._body_or_semicolon,
    ),

    requirement_verification_usage: $ => seq(
      'verify',
      $._requirement_reference_or_declaration,
      optional(seq('by', field('subject', $._type_reference))),
      $._body_or_semicolon,
    ),

    objective_requirement_usage: $ => seq(
      'objective',
      repeat($.prefix_metadata),
      optional($._declaration),
      optional($.value_part),
      $._body_or_semicolon,
    ),

    view_rendering_usage: $ => seq(
      'render',
      $._rendering_reference_or_declaration,
      $._body_or_semicolon,
    ),

    expose: $ => seq('expose', $._import_target, $._body_or_semicolon),

    // ---------------------------------------------------------------
    // Action nodes and successions
    // ---------------------------------------------------------------

    _action_node: $ => choice(
      $.send_node,
      $.accept_node,
      $.assignment_node,
      $.if_node,
      $.while_loop_node,
      $.for_loop_node,
      $.terminate_node,
      $.merge_node,
      $.decision_node,
      $.join_node,
      $.fork_node,
    ),

    _action_node_declaration: $ => seq('action', optional($._declaration)),

    send_node: $ => seq(
      optional($._prefix),
      optional($._action_node_declaration),
      'send',
      optional(field('payload', $.expression)),
      optional(choice(
        seq('via', field('sender', $.expression), optional(seq('to', field('receiver', $.expression)))),
        seq('to', field('receiver', $.expression)),
      )),
      $._body_or_semicolon,
    ),

    accept_node: $ => seq(
      optional($._prefix),
      optional($._action_node_declaration),
      $._accept_parameter_part,
      $._body_or_semicolon,
    ),

    _accept_parameter_part: $ => seq(
      'accept',
      $.payload_parameter,
      optional(seq('via', field('receiver', $.expression))),
    ),

    payload_parameter: $ => choice(
      $.payload,
      seq(optional($._identification), $._feature_specialization_part),
      seq(optional($._identification), optional($._feature_specialization_part), $.trigger_expression),
      prec.dynamic(-1, $.invocation_expression),
    ),

    trigger_expression: $ => seq(
      field('kind', choice('at', 'after', 'when')),
      $.expression,
    ),

    assignment_node: $ => seq(
      optional($._prefix),
      optional($._action_node_declaration),
      'assign',
      field('target', $.expression),
      ':=',
      field('value', $.expression),
      $._body_or_semicolon,
    ),

    if_node: $ => seq(
      optional($._prefix),
      optional($._action_node_declaration),
      'if',
      field('condition', $.expression),
      field('consequence', $.action_body_parameter),
      optional(seq('else', field('alternative', choice($.action_body_parameter, $.if_node)))),
    ),

    action_body_parameter: $ => seq(optional($._action_node_declaration), $.body),

    while_loop_node: $ => seq(
      optional($._prefix),
      optional($._action_node_declaration),
      choice(seq('while', field('condition', $.expression)), 'loop'),
      $.action_body_parameter,
      optional(seq('until', field('until', $.expression), ';')),
    ),

    for_loop_node: $ => seq(
      optional($._prefix),
      optional($._action_node_declaration),
      'for',
      $.for_variable,
      'in',
      field('sequence', $.expression),
      $.action_body_parameter,
    ),

    for_variable: $ => $._declaration,

    terminate_node: $ => seq(
      optional($._prefix),
      optional($._action_node_declaration),
      'terminate',
      optional(field('occurrence', $.expression)),
      $._body_or_semicolon,
    ),

    merge_node: $ => seq(optional($._prefix), 'merge', optional($._declaration), $._body_or_semicolon),
    decision_node: $ => seq(optional($._prefix), 'decide', optional($._declaration), $._body_or_semicolon),
    join_node: $ => seq(optional($._prefix), 'join', optional($._declaration), $._body_or_semicolon),
    fork_node: $ => seq(optional($._prefix), 'fork', optional($._declaration), $._body_or_semicolon),

    final_node: $ => seq('done', optional(field('name', $._name)), $._body_or_semicolon),

    initial_node_member: $ => seq(optional($._prefix), 'first', field('target', $.qualified_name), $._body_or_semicolon),

    empty_succession: $ => prec.dynamic(-1, seq('then', optional($.multiplicity_range))),

    target_succession: $ => seq(
      optional($.multiplicity_range),
      'then',
      field('target', $.connector_end),
      $._body_or_semicolon,
    ),

    target_transition: $ => seq(
      optional($._prefix),
      choice(
        seq('transition', optional($.trigger), optional($.guard), optional($.effect)),
        seq($.trigger, optional($.guard), optional($.effect)),
        seq($.guard, optional($.effect)),
      ),
      'then',
      field('target', $.connector_end),
      $._body_or_semicolon,
    ),

    default_target_succession: $ => seq('else', field('target', $.connector_end), $._body_or_semicolon),

    transition_usage: $ => seq(
      'transition',
      optional(seq(optional($._declaration), 'first')),
      field('source', $._type_reference),
      optional($.trigger),
      optional($.guard),
      optional($.effect),
      'then',
      field('target', $.connector_end),
      $._body_or_semicolon,
    ),

    trigger: $ => choice($._accept_parameter_part, seq('when', $.expression)),

    guard: $ => seq('if', field('condition', $.expression)),

    effect: $ => seq('do', optional(choice($.body, seq($._performed_action, optional($.body))))),

    // ---------------------------------------------------------------
    // States
    // ---------------------------------------------------------------

    state_subaction: $ => seq(
      field('kind', choice('entry', 'do', 'exit')),
      choice(';', field('body', $.body), seq($._performed_action, $._body_or_semicolon)),
    ),

    _performed_action: $ => choice(
      seq(optional('perform'), $._performed_action_reference, optional($.value_part)),
      seq(optional($._action_node_declaration), $._accept_parameter_part),
      seq(
        optional($._action_node_declaration),
        'send',
        optional(field('payload', $.expression)),
        optional(choice(
          seq('via', field('sender', $.expression), optional(seq('to', field('receiver', $.expression)))),
          seq('to', field('receiver', $.expression)),
        )),
      ),
      seq(
        optional($._action_node_declaration),
        'assign',
        field('target', $.expression),
        ':=',
        field('value', $.expression),
      ),
    ),

    pseudostate: $ => seq(
      field('kind', choice('choice', 'junction', 'history', seq('shallow', 'history'), seq('deep', 'history'))),
      field('name', $._name),
      ';',
    ),

    defer_member: $ => seq('defer', commaSep1($.expression), ';'),

    // ---------------------------------------------------------------
    // Helpers shared by several rules above
    // ---------------------------------------------------------------

    _performed_action_reference: $ => choice(
      seq($._type_reference, optional($._feature_specialization_part)),
      seq('action', optional($._declaration)),
    ),

    _constraint_reference_or_declaration: memberReferenceOrDeclaration('constraint'),
    _concern_reference_or_declaration: memberReferenceOrDeclaration('concern'),
    _requirement_reference_or_declaration: memberReferenceOrDeclaration('requirement'),
    _rendering_reference_or_declaration: memberReferenceOrDeclaration('rendering'),
  };
}

/**
 * KerML-only rules: types, features and standalone relationships.
 */
function kermlRules() {
  /**
   * @param {RuleOrLiteral} keyword
   */
  const type = keyword => $ => seq(
    optional($._prefix),
    keyword,
    optional($._type_declaration),
    $._body_or_semicolon,
  );

  /**
   * @param {RuleOrLiteral} keyword
   */
  const feature = keyword => $ => seq(
    optional($._prefix),
    keyword,
    optional($._declaration),
    optional($.value_part),
    $._body_or_semicolon,
  );

  /**
   * @param {RuleOrLiteral} keyword
   * @param {RuleOrLiteral} relation
   * @param {RuleOrLiteral} label
   */
  const relationship = (label, keyword, relation) => $ => seq(
    optional(seq(label, optional($._identification))),
    keyword,
    field('source', $._type_reference),
    relation,
    field('target', $._type_reference),
    $._body_or_semicolon,
  );

  return {
    _type_element: $ => choice(
      $.type,
      $.classifier,
      $.class,
      $.structure,
      $.data_type,
      $.association,
      $.association_structure,
      $.behavior,
      $.function,
      $.predicate,
      $.interaction,
      $.metaclass,
      $.multiplicity,
    ),

    _type_declaration: $ => optionalSeq(
      'all',
      $._identification,
      $.multiplicity_range,
      choice($.specializes, $.conjugates),
      repeat1(choice($.disjoint_from, $.unions, $.intersects, $.differences, $.featured_by)),
    ),

    type: type('type'),
    classifier: type('classifier'),
    class: type('class'),
    structure: type('struct'),
    data_type: type('datatype'),
    association: type('assoc'),
    association_structure: type(seq('assoc', 'struct')),
    behavior: type('behavior'),
    function: type('function'),
    predicate: type('predicate'),
    interaction: type('interaction'),
    metaclass: type('metaclass'),

    multiplicity: $ => seq(
      'multiplicity',
      optional($._identification),
      choice($.subsets, $.multiplicity_range),
      $._body_or_semicolon,
    ),

    _feature_element: $ => choice(
      $.feature,
      $.step,
      $.expression_feature,
      $.boolean_expression,
      $.invariant,
      $.connector,
      $.binding_connector,
      $.succession,
      $.flow,
      $.succession_flow,
    ),

    feature: $ => seq(
      optional($._prefix),
      choice(
        seq('feature', optional($._declaration)),
        $._declaration,
      ),
      optional($.value_part),
      $._body_or_semicolon,
    ),

    step: feature('step'),
    expression_feature: feature('expr'),
    boolean_expression: feature('bool'),

    invariant: $ => seq(
      optional($._prefix),
      'inv',
      optional(choice('true', 'false')),
      optional($._declaration),
      optional($.value_part),
      $._body_or_semicolon,
    ),

    connector: $ => seq(
      optional($._prefix),
      'connector',
      choice(
        seq(optional($._declaration), optional($.value_part)),
        seq(
          optional(choice(seq(optional($._declaration), 'from'), seq('all', optional('from')))),
          field('source', $.connector_end), 'to', field('target', $.connector_end),
        ),
        seq(optional($._declaration), '(', commaSep2(field('end', $.connector_end)), ')'),
      ),
      $._body_or_semicolon,
    ),

    binding_connector: $ => seq(
      optional($._prefix),
      'binding',
      choice(
        seq($._declaration, optional(seq('of', field('source', $.connector_end), '=', field('target', $.connector_end)))),
        seq(optional('all'), optional(seq(optional('of'), field('source', $.connector_end), '=', field('target', $.connector_end)))),
      ),
      $._body_or_semicolon,
    ),

    succession: $ => seq(
      optional($._prefix),
      'succession',
      choice(
        seq($._declaration, optional(seq('first', field('source', $.connector_end), 'then', field('target', $.connector_end)))),
        seq(optional('all'), optional(seq(optional('first'), field('source', $.connector_end), 'then', field('target', $.connector_end)))),
      ),
      $._body_or_semicolon,
    ),

    flow: $ => seq(optional($._prefix), 'flow', optional($._flow_declaration), $._body_or_semicolon),

    succession_flow: $ => seq(optional($._prefix), 'succession', 'flow', optional($._flow_declaration), $._body_or_semicolon),

    _relationship_element: $ => choice(
      $.specialization,
      $.subclassification,
      $.feature_typing,
      $.subsetting,
      $.redefinition,
      $.conjugation,
      $.disjoining,
      $.feature_inverting,
      $.type_featuring,
    ),

    specialization: relationship('specialization', 'subtype', choice(':>', 'specializes')),
    subclassification: relationship('specialization', 'subclassifier', choice(':>', 'specializes')),
    feature_typing: relationship('specialization', 'typing', choice(':', seq('typed', 'by'))),
    subsetting: relationship('specialization', 'subset', choice(':>', 'subsets')),
    redefinition: relationship('specialization', 'redefinition', choice(':>>', 'redefines')),
    conjugation: relationship('conjugation', 'conjugate', choice('~', 'conjugates')),
    disjoining: relationship('disjoining', 'disjoint', 'from'),
    feature_inverting: relationship('inverting', 'inverse', 'of'),

    type_featuring: $ => seq(
      'featuring',
      optional(seq(optional($._identification), 'of')),
      field('source', $.qualified_name),
      'by',
      field('target', $.qualified_name),
      $._body_or_semicolon,
    ),

    return_member: $ => seq('return', $._feature_element),
  };
}
