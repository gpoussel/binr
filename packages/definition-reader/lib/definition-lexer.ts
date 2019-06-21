import { createToken, Lexer, TokenType } from "chevrotain";
import * as escapeStringRegexp from "escape-string-regexp";
import { fromPairs, map, values } from "lodash";

const WhitespaceToken = createToken({
  name: "WhitespaceToken",
  pattern: /[ \t\r\n]+/,
  group: Lexer.SKIPPED,
});

const SingleLineCommentToken = createToken({
  name: "SingleLineCommentToken",
  pattern: /\/\/.+/,
  group: "comments",
});

const MultiLineCommentToken = createToken({
  name: "MultiLineCommentToken",
  pattern: /\/\*[\s\S]+?\*\//,
  group: "comments",
});

const IdentifierToken = createToken({
  name: "IdentifierToken",
  pattern: /[a-z_][a-z0-9_]*/i,
});

const StringLiteralToken = createToken({
  name: "StringLiteralToken",
  pattern: /"(:?[^\\"\n\r]+|\\(:?[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*"/,
});

const NumberHexadecimalLiteralToken = createToken({
  name: "NumberHexadecimalLiteralToken",
  pattern: /0x[A-F0-9]+/i,
});

const NumberBinaryLiteralToken = createToken({
  name: "NumberBinaryLiteralToken",
  pattern: /0b[01]+/i,
});

const NumberDecimalLiteralToken = createToken({
  name: "NumberDecimalLiteralToken",
  pattern: /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/,
});

const symbolTokens = fromPairs(
  map(
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
      Hash: "#",
      Comma: ",",
      At: "@",
    },
    (keyword, name) => [
      `${name}Token`,
      createToken({
        name: `${name}Token`,
        pattern: new RegExp(escapeStringRegexp(keyword)),
      }),
    ],
  ),
);

const keywordTokens = fromPairs(
  map(
    {
      True: "true",
      False: "false",
      Struct: "struct",
      Export: "export",
      Enum: "enum",
      Extends: "extends",
      Bitmask: "bitmask",
      If: "if",
      Else: "else",
      Until: "until",
      Switch: "switch",
    },
    (keyword, name) => [
      `${name}Token`,
      createToken({
        name: `${name}Token`,
        pattern: new RegExp(escapeStringRegexp(keyword)),
      }),
    ],
  ),
);

export const tokens: { [key: string]: TokenType } = {
  // Whitespaces
  WhitespaceToken,

  // Comments
  SingleLineCommentToken,
  MultiLineCommentToken,

  // Symbols
  ...symbolTokens,

  // Keywords
  ...keywordTokens,

  // Identifiers
  IdentifierToken,
  StringLiteralToken,

  // Number literals
  NumberHexadecimalLiteralToken,
  NumberBinaryLiteralToken,
  NumberDecimalLiteralToken,
};

export class DefinitionLexer extends Lexer {
  constructor() {
    super(values(tokens), {
      ensureOptimizations: true,
    });
  }
}
