const error  = 'error';
const warn   = 'warn';
const off    = 'off';
const always = 'always';

module.exports = {
  extends: [
    'airbnb-base',
  ],
  rules: {
    'arrow-parens':                      [error, 'as-needed'],
    'camelcase':                         [warn],
    'no-param-reassign':                 [warn],
    'object-curly-newline':              [warn, { consistent: true }],
    'implicit-arrow-linebreak':          [off],
    'prefer-template':                   [warn],
    'space-before-function-paren':       [error, always],

    'key-spacing': [error, {
      singleLine: { mode: 'strict' },
      multiLine:  { mode: 'minimum' },
    }],

    'no-multi-spaces': [warn, {
      exceptions: {
        Property:           true,
        VariableDeclarator: true,
        ImportDeclaration:  true,
        BinaryExpression:   true,
      },
    }],

    'no-unused-expressions': [warn, {
      allowShortCircuit:    true,
      allowTernary:         true,
      allowTaggedTemplates: true,
    }],
  },
};
