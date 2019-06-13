"use strict";

const _ = require("lodash");
const chevrotain = require("chevrotain");
const escapeRegexp = require("escape-string-regexp");

const { createToken, Lexer } = chevrotain;

const Whitespace = createToken({
  name: "Whitespace",
  pattern: /[ \t\r\n]+/,
  group: Lexer.SKIPPED,
});

const EscapedLineBreak = createToken({
  name: "EscapedLineBreak",
  pattern: /\\\r?\n/,
  group: Lexer.SKIPPED,
});

const SingleLineComment = createToken({
  name: "SingleLineComment",
  pattern: /\/\/.*/,
  group: "comments",
});

const MultiLineComment = createToken({
  name: "MultiLineComment",
  pattern: /\/\*[\s\S]+?\*\//,
  group: "comments",
});

const StringLiteral = createToken({
  name: "StringLiteral",
  pattern: /L?(["'])(?:(?=(\\?))\2.)*?\1/,
});

const Identifier = createToken({
  name: "Identifier",
  pattern: /[a-z_][a-z0-9_]*/i,
  longer_alt: StringLiteral,
});

const NumberDecimalLiteral = createToken({
  name: "NumberDecimalLiteral",
  pattern: /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?[Ll]?/,
});

const NumberBinaryLiteral = createToken({
  name: "NumberBinaryLiteral",
  pattern: /0b[01]+/,
});

const NumberHexadecimalLiteral = createToken({
  name: "NumberHexadecimalLiteral",
  pattern: /0x[A-F0-9]+L?/i,
});

const NumberHexadecimalLiteral2 = createToken({
  name: "NumberHexadecimalLiteral2",
  pattern: /[0-9][0-9a-f]h/i,
});

const NumberOctalLiteral = createToken({
  name: "NumberOctalLiteral",
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
      name,
      createToken({
        name,
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
      _.upperFirst(keyword),
      createToken({
        name: _.upperFirst(keyword),
        pattern: new RegExp(escapeRegexp(keyword)),
        longer_alt: Identifier,
      }),
    ]
  )
);

const tokens = {
  // Whitespaces
  Whitespace,
  EscapedLineBreak,

  // Comments
  SingleLineComment,
  MultiLineComment,

  // Symbols
  ...symbolTokens,

  // Keywords
  ...keywordTokens,

  Identifier,
  StringLiteral,
  NumberHexadecimalLiteral,
  NumberHexadecimalLiteral2,
  NumberBinaryLiteral,
  NumberOctalLiteral,
  NumberDecimalLiteral,
};

class SweetscapeLexer extends Lexer {
  constructor() {
    super(_.values(tokens), {
      ensureOptimizations: true,
    });
  }
}
module.exports = { SweetscapeLexer, tokens };
