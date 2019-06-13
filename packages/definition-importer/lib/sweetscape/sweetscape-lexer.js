"use strict";

const _ = require("lodash");
const chevrotain = require("chevrotain");
const escapeRegexp = require("escape-string-regexp");

const { createToken, Lexer } = chevrotain;

const WhitespaceToken = createToken({
  name: "WhitespaceToken",
  pattern: /[ \t\r\n]+/,
  group: Lexer.SKIPPED,
});

const EscapedLineBreakToken = createToken({
  name: "EscapedLineBreakToken",
  pattern: /\\\r?\n/,
  group: Lexer.SKIPPED,
});

const SingleLineCommentToken = createToken({
  name: "SingleLineCommentToken",
  pattern: /\/\/.*/,
  group: "comments",
});

const MultiLineCommentToken = createToken({
  name: "MultiLineCommentToken",
  pattern: /\/\*[\s\S]+?\*\//,
  group: "comments",
});

const StringLiteralToken = createToken({
  name: "StringLiteralToken",
  pattern: /L?(["'])(?:(?=(\\?))\2.)*?\1/,
});

const IdentifierToken = createToken({
  name: "IdentifierToken",
  pattern: /[a-z_][a-z0-9_]*/i,
  longer_alt: StringLiteralToken,
});

const NumberDecimalLiteralToken = createToken({
  name: "NumberDecimalLiteralToken",
  pattern: /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?[Ll]?/,
});

const NumberBinaryLiteralToken = createToken({
  name: "NumberBinaryLiteralToken",
  pattern: /0b[01]+/,
});

const NumberHexadecimalLiteralToken = createToken({
  name: "NumberHexadecimalLiteralToken",
  pattern: /0x[A-F0-9]+L?/i,
});

const NumberHexadecimalLiteralToken2 = createToken({
  name: "NumberHexadecimalLiteralToken2",
  pattern: /[0-9][0-9a-f]h/i,
});

const NumberOctalLiteralToken = createToken({
  name: "NumberOctalLiteralToken",
  pattern: /0[0-7]+/,
});

const symbolTokens = _.fromPairs(
  _.map(
    {
      // Assignment operators
      MultiplicationEquals: "*=",
      DivisionEquals: "/=",
      ModuloEquals: "%=",
      PlusEquals: "+=",
      MinusEquals: "-=",
      ShiftLeftEquals: "<<=",
      ShiftRightEquals: ">>=",
      UnsignedShiftRightEquals: ">>>=",
      BinaryAndEquals: "&=",
      BinaryXorEquals: "^=",
      BinaryOrEquals: "|=",

      // Bit-wise shift operations
      UnsignedShiftRight: ">>>",
      ShiftLeft: "<<",
      ShiftRight: ">>",

      // Comparison token
      DoubleEquals: "==",
      Different: "!=",
      GreaterOrEqual: ">=",
      LessOrEqual: "<=",
      Greater: ">",
      Less: "<",

      // Boolean operations
      BooleanAnd: "&&",
      BooleanOr: "||",
      Exclamation: "!",

      // Bit-wise manipulation
      BinaryAnd: "&",
      BinaryOr: "|",
      BinaryXor: "^",
      Tilda: "~",

      // Parenthesis, brackets, etc.
      CurlyBraceOpen: "{",
      CurlyBraceClose: "}",
      BracketOpen: "[",
      BracketClose: "]",
      ParenthesisOpen: "(",
      ParenthesisClose: ")",

      // Increment and decrement
      DoublePlus: "++",
      DoubleMinus: "--",

      // Math operators
      Plus: "+",
      Minus: "-",
      Multiplication: "*",
      Division: "/",
      Modulo: "%",

      // Others
      DoubleArrow: "=>",
      Equals: "=",
      Question: "?",
      Period: ".",
      SemiColon: ";",
      Colon: ":",
      Comma: ",",
      At: "@",
    },
    (keyword, name) => [
      `${name}Token`,
      createToken({
        name: `${name}Token`,
        pattern: new RegExp(escapeRegexp(keyword)),
      }),
    ]
  )
);

const keywordTokens = _.fromPairs(
  _.map(
    [
      // Modifiers
      "local",
      "const",

      // Control structures
      "if",
      "else",
      "return",
      "break",
      "do",
      "while",
      "for",
      "enum",
      "switch",
      "case",
      "default",

      // Top-level elements
      "struct",
      "union",

      // Types
      "typedef",
      "void",
      "signed",
      "unsigned",

      // Special functions
      "sizeof",
    ],
    keyword => [
      `${_.upperFirst(keyword)}Token`,
      createToken({
        name: `${_.upperFirst(keyword)}Token`,
        pattern: new RegExp(escapeRegexp(keyword)),
        longer_alt: IdentifierToken,
      }),
    ]
  )
);

const tokens = {
  // Whitespaces
  WhitespaceToken,
  EscapedLineBreakToken,

  // Comments
  SingleLineCommentToken,
  MultiLineCommentToken,

  // Symbols
  ...symbolTokens,

  // Keywords
  ...keywordTokens,

  IdentifierToken,
  StringLiteralToken,
  NumberHexadecimalLiteralToken,
  NumberHexadecimalLiteralToken2,
  NumberBinaryLiteralToken,
  NumberOctalLiteralToken,
  NumberDecimalLiteralToken,
};

class SweetscapeLexer extends Lexer {
  constructor() {
    super(_.values(tokens), {
      ensureOptimizations: true,
    });
  }
}
module.exports = { SweetscapeLexer, tokens };
