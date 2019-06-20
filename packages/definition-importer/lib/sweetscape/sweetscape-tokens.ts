"use strict";

const _ = require("lodash");
const chevrotain = require("chevrotain");
const escapeRegexp = require("escape-string-regexp");
const SEnum = require("string-enum");

export const TokenName = SEnum(
  "Whitespace",
  "EscapedLineBreak",
  "SingleLineComment",
  "MultiLineComment",
  "MultiplicationEquals",
  "DivisionEquals",
  "ModuloEquals",
  "PlusEquals",
  "MinusEquals",
  "ShiftLeftEquals",
  "ShiftRightEquals",
  "UnsignedShiftRightEquals",
  "BinaryAndEquals",
  "BinaryXorEquals",
  "BinaryOrEquals",
  "UnsignedShiftRight",
  "ShiftLeft",
  "ShiftRight",
  "DoubleEquals",
  "Different",
  "GreaterOrEqual",
  "LessOrEqual",
  "Greater",
  "Less",
  "BooleanAnd",
  "BooleanOr",
  "Exclamation",
  "BinaryAnd",
  "BinaryOr",
  "BinaryXor",
  "Tilda",
  "CurlyBraceOpen",
  "CurlyBraceClose",
  "BracketOpen",
  "BracketClose",
  "ParenthesisOpen",
  "ParenthesisClose",
  "DoublePlus",
  "DoubleMinus",
  "Plus",
  "Minus",
  "Multiplication",
  "Division",
  "Modulo",
  "DoubleArrow",
  "Equals",
  "Question",
  "Period",
  "SemiColon",
  "Colon",
  "Comma",
  "At",
  "Local",
  "Const",
  "If",
  "Else",
  "Return",
  "Break",
  "Do",
  "While",
  "For",
  "Enum",
  "Switch",
  "Case",
  "Default",
  "Struct",
  "Union",
  "Typedef",
  "Void",
  "Signed",
  "Unsigned",
  "Sizeof",
  "True",
  "False",
  "Identifier",
  "StringLiteral",
  "NumberHexadecimalLiteral",
  "NumberHexadecimalLiteral2",
  "NumberBinaryLiteral",
  "NumberOctalLiteral",
  "NumberDecimalLiteral",
);

const tokenInfos = [];

/**
 * Whitespaces
 */
tokenInfos.push({
  name: TokenName.Whitespace,
  pattern: /[ \t\r\n]+/,
  group: chevrotain.Lexer.SKIPPED,
});

/**
 * Escaped line breaks (i.e. line ending with a backslash)
 */
tokenInfos.push({
  name: TokenName.EscapedLineBreak,
  pattern: /\\\r?\n/,
  group: chevrotain.Lexer.SKIPPED,
});

/**
 * Single-line comments, i.e. starting with //
 */
tokenInfos.push({
  name: TokenName.SingleLineComment,
  pattern: /\/\/.*/,
  group: "comments",
});

/**
 * Multi-line comments, i.e. starting with /*
 */
tokenInfos.push({
  name: TokenName.MultiLineComment,
  pattern: /\/\*[\s\S]+?\*\//,
  group: "comments",
});

/**
 * All characters (or set of characters) considered as symbols
 * in the language.
 */
_.each(
  [
    // Assignment operators
    { name: TokenName.MultiplicationEquals, symbol: "*=" },
    { name: TokenName.DivisionEquals, symbol: "/=" },
    { name: TokenName.ModuloEquals, symbol: "%=" },
    { name: TokenName.PlusEquals, symbol: "+=" },
    { name: TokenName.MinusEquals, symbol: "-=" },
    { name: TokenName.ShiftLeftEquals, symbol: "<<=" },
    { name: TokenName.ShiftRightEquals, symbol: ">>=" },
    { name: TokenName.UnsignedShiftRightEquals, symbol: ">>>=" },
    { name: TokenName.BinaryAndEquals, symbol: "&=" },
    { name: TokenName.BinaryXorEquals, symbol: "^=" },
    { name: TokenName.BinaryOrEquals, symbol: "|=" },

    // Bit-wise shift operations
    { name: TokenName.UnsignedShiftRight, symbol: ">>>" },
    { name: TokenName.ShiftLeft, symbol: "<<" },
    { name: TokenName.ShiftRight, symbol: ">>" },

    // Comparison token
    { name: TokenName.DoubleEquals, symbol: "==" },
    { name: TokenName.Different, symbol: "!=" },
    { name: TokenName.GreaterOrEqual, symbol: ">=" },
    { name: TokenName.LessOrEqual, symbol: "<=" },
    { name: TokenName.Greater, symbol: ">" },
    { name: TokenName.Less, symbol: "<" },

    // Boolean operations
    { name: TokenName.BooleanAnd, symbol: "&&" },
    { name: TokenName.BooleanOr, symbol: "||" },
    { name: TokenName.Exclamation, symbol: "!" },

    // Bit-wise manipulation
    { name: TokenName.BinaryAnd, symbol: "&" },
    { name: TokenName.BinaryOr, symbol: "|" },
    { name: TokenName.BinaryXor, symbol: "^" },
    { name: TokenName.Tilda, symbol: "~" },

    // Parenthesis, brackets, etc.
    { name: TokenName.CurlyBraceOpen, symbol: "{" },
    { name: TokenName.CurlyBraceClose, symbol: "}" },
    { name: TokenName.BracketOpen, symbol: "[" },
    { name: TokenName.BracketClose, symbol: "]" },
    { name: TokenName.ParenthesisOpen, symbol: "(" },
    { name: TokenName.ParenthesisClose, symbol: ")" },

    // Increment and decrement
    { name: TokenName.DoublePlus, symbol: "++" },
    { name: TokenName.DoubleMinus, symbol: "--" },

    // Math operators
    { name: TokenName.Plus, symbol: "+" },
    { name: TokenName.Minus, symbol: "-" },
    { name: TokenName.Multiplication, symbol: "*" },
    { name: TokenName.Division, symbol: "/" },
    { name: TokenName.Modulo, symbol: "%" },

    // Others
    { name: TokenName.DoubleArrow, symbol: "=>" },
    { name: TokenName.Equals, symbol: "=" },
    { name: TokenName.Question, symbol: "?" },
    { name: TokenName.Period, symbol: "." },
    { name: TokenName.SemiColon, symbol: ";" },
    { name: TokenName.Colon, symbol: ":" },
    { name: TokenName.Comma, symbol: "," },
    { name: TokenName.At, symbol: "@" },
  ],
  (symbolInfo) =>
    tokenInfos.push({
      name: symbolInfo.name,
      pattern: new RegExp(escapeRegexp(symbolInfo.symbol)),
    }),
);

/**
 * All "special" identifiers, considered as keywords in the grammar
 */
_.each(
  [
    // Modifiers
    { name: TokenName.Local, keyword: "local" },
    { name: TokenName.Const, keyword: "const" },

    // Control structures
    { name: TokenName.If, keyword: "if" },
    { name: TokenName.Else, keyword: "else" },
    { name: TokenName.Return, keyword: "return" },
    { name: TokenName.Break, keyword: "break" },
    { name: TokenName.Do, keyword: "do" },
    { name: TokenName.While, keyword: "while" },
    { name: TokenName.For, keyword: "for" },
    { name: TokenName.Enum, keyword: "enum" },
    { name: TokenName.Switch, keyword: "switch" },
    { name: TokenName.Case, keyword: "case" },
    { name: TokenName.Default, keyword: "default" },

    // Top-level elements
    { name: TokenName.Struct, keyword: "struct" },
    { name: TokenName.Union, keyword: "union" },

    // Types
    { name: TokenName.Typedef, keyword: "typedef" },
    { name: TokenName.Void, keyword: "void" },
    { name: TokenName.Signed, keyword: "signed" },
    { name: TokenName.Unsigned, keyword: "unsigned" },

    // Booleans
    { name: TokenName.True, keyword: "true" },
    { name: TokenName.False, keyword: "false" },

    // Special functions
    { name: TokenName.Sizeof, keyword: "sizeof" },
  ],
  (keywordInfo) =>
    tokenInfos.push({
      name: keywordInfo.name,
      pattern: new RegExp(keywordInfo.keyword),
      longer_alt: TokenName.Identifier,
    }),
);

tokenInfos.push({
  name: TokenName.Identifier,
  pattern: /[a-z_][a-z0-9_]*/i,
  longer_alt: TokenName.StringLiteral,
});

tokenInfos.push({
  name: TokenName.StringLiteral,
  pattern: /L?(["'])(?:(?=(\\?))\2.)*?\1/,
});

tokenInfos.push({
  name: TokenName.NumberHexadecimalLiteral,
  pattern: /0x[A-F0-9]+L?/i,
});

tokenInfos.push({
  name: TokenName.NumberHexadecimalLiteral2,
  pattern: /[0-9][0-9a-f]h/i,
});

tokenInfos.push({
  name: TokenName.NumberBinaryLiteral,
  pattern: /0b[01]+/,
});

tokenInfos.push({
  name: TokenName.NumberOctalLiteral,
  pattern: /0[0-7]+/,
});

tokenInfos.push({
  name: TokenName.NumberDecimalLiteral,
  pattern: /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?[Ll]?/,
});

// Some tokens, with a "longer_alt" attribute set, have to be created after other ones
const createdTokens = {};
_.map(_.filter(tokenInfos, (tokenInfo) => !_.has(tokenInfo, "longer_alt")), (tokenInfo) => {
  createdTokens[tokenInfo.name] = chevrotain.createToken(tokenInfo);
});

const remainingTokens = _.filter(tokenInfos, (tokenInfo) => _.has(tokenInfo, "longer_alt"));
while (!_.isEmpty(remainingTokens)) {
  for (let i = 0; i < remainingTokens.length; i += 1) {
    const remainingToken = remainingTokens[i];
    if (_.has(createdTokens, remainingToken.longer_alt)) {
      // The "longer_alt" references an already created token, so we can create the current one immediately
      remainingToken.longer_alt = createdTokens[remainingToken.longer_alt];
      createdTokens[remainingToken.name] = chevrotain.createToken(remainingToken);
      remainingTokens.splice(i, 1);
      i -= 1;
    }
  }
}

// At this point, all tokens have been created
// But the order or creation (in the "createdTokens" array) is not the correct order of tokens
// So we have to iterate through "tokenInfos" one last time
export const tokens = _.fromPairs(
  _.map(tokenInfos, (tokenInfo) => [tokenInfo.name, createdTokens[tokenInfo.name]]),
);
