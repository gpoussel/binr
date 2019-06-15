"use strict";

const _ = require("lodash");
const chevrotain = require("chevrotain");
const escapeRegexp = require("escape-string-regexp");

const { createToken, Lexer } = chevrotain;

const tokenInfos = [];

/**
 * Whitespaces
 */
tokenInfos.push({
  name: "Whitespace",
  pattern: /[ \t\r\n]+/,
  group: Lexer.SKIPPED,
});

/**
 * Escaped line breaks (i.e. line ending with a backslash)
 */
tokenInfos.push({
  name: "EscapedLineBreak",
  pattern: /\\\r?\n/,
  group: Lexer.SKIPPED,
});

/**
 * Single-line comments, i.e. starting with //
 */
tokenInfos.push({
  name: "SingleLineComment",
  pattern: /\/\/.*/,
  group: "comments",
});

/**
 * Multi-line comments, i.e. starting with /*
 */
tokenInfos.push({
  name: "MultiLineComment",
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
    { name: "MultiplicationEquals", symbol: "*=" },
    { name: "DivisionEquals", symbol: "/=" },
    { name: "ModuloEquals", symbol: "%=" },
    { name: "PlusEquals", symbol: "+=" },
    { name: "MinusEquals", symbol: "-=" },
    { name: "ShiftLeftEquals", symbol: "<<=" },
    { name: "ShiftRightEquals", symbol: ">>=" },
    { name: "UnsignedShiftRightEquals", symbol: ">>>=" },
    { name: "BinaryAndEquals", symbol: "&=" },
    { name: "BinaryXorEquals", symbol: "^=" },
    { name: "BinaryOrEquals", symbol: "|=" },

    // Bit-wise shift operations
    { name: "UnsignedShiftRight", symbol: ">>>" },
    { name: "ShiftLeft", symbol: "<<" },
    { name: "ShiftRight", symbol: ">>" },

    // Comparison token
    { name: "DoubleEquals", symbol: "==" },
    { name: "Different", symbol: "!=" },
    { name: "GreaterOrEqual", symbol: ">=" },
    { name: "LessOrEqual", symbol: "<=" },
    { name: "Greater", symbol: ">" },
    { name: "Less", symbol: "<" },

    // Boolean operations
    { name: "BooleanAnd", symbol: "&&" },
    { name: "BooleanOr", symbol: "||" },
    { name: "Exclamation", symbol: "!" },

    // Bit-wise manipulation
    { name: "BinaryAnd", symbol: "&" },
    { name: "BinaryOr", symbol: "|" },
    { name: "BinaryXor", symbol: "^" },
    { name: "Tilda", symbol: "~" },

    // Parenthesis, brackets, etc.
    { name: "CurlyBraceOpen", symbol: "{" },
    { name: "CurlyBraceClose", symbol: "}" },
    { name: "BracketOpen", symbol: "[" },
    { name: "BracketClose", symbol: "]" },
    { name: "ParenthesisOpen", symbol: "(" },
    { name: "ParenthesisClose", symbol: ")" },

    // Increment and decrement
    { name: "DoublePlus", symbol: "++" },
    { name: "DoubleMinus", symbol: "--" },

    // Math operators
    { name: "Plus", symbol: "+" },
    { name: "Minus", symbol: "-" },
    { name: "Multiplication", symbol: "*" },
    { name: "Division", symbol: "/" },
    { name: "Modulo", symbol: "%" },

    // Others
    { name: "DoubleArrow", symbol: "=>" },
    { name: "Equals", symbol: "=" },
    { name: "Question", symbol: "?" },
    { name: "Period", symbol: "." },
    { name: "SemiColon", symbol: ";" },
    { name: "Colon", symbol: ":" },
    { name: "Comma", symbol: "," },
    { name: "At", symbol: "@" },
  ],
  symbolInfo =>
    tokenInfos.push({
      name: symbolInfo.name,
      pattern: new RegExp(escapeRegexp(symbolInfo.symbol)),
    })
);

/**
 * All "special" identifiers, considered as keywords in the grammar
 */
_.each(
  [
    // Modifiers
    { name: "Local", keyword: "local" },
    { name: "Const", keyword: "const" },

    // Control structures
    { name: "If", keyword: "if" },
    { name: "Else", keyword: "else" },
    { name: "Return", keyword: "return" },
    { name: "Break", keyword: "break" },
    { name: "Do", keyword: "do" },
    { name: "While", keyword: "while" },
    { name: "For", keyword: "for" },
    { name: "Enum", keyword: "enum" },
    { name: "Switch", keyword: "switch" },
    { name: "Case", keyword: "case" },
    { name: "Default", keyword: "default" },

    // Top-level elements
    { name: "Struct", keyword: "struct" },
    { name: "Union", keyword: "union" },

    // Types
    { name: "Typedef", keyword: "typedef" },
    { name: "Void", keyword: "void" },
    { name: "Signed", keyword: "signed" },
    { name: "Unsigned", keyword: "unsigned" },

    // Special functions
    { name: "Sizeof", keyword: "sizeof" },
  ],
  keywordInfo =>
    tokenInfos.push({
      name: keywordInfo.name,
      pattern: new RegExp(keywordInfo.keyword),
      longer_alt: "Identifier",
    })
);

tokenInfos.push({
  name: "Identifier",
  pattern: /[a-z_][a-z0-9_]*/i,
  longer_alt: "StringLiteral",
});

tokenInfos.push({
  name: "StringLiteral",
  pattern: /L?(["'])(?:(?=(\\?))\2.)*?\1/,
});

tokenInfos.push({
  name: "NumberHexadecimalLiteral",
  pattern: /0x[A-F0-9]+L?/i,
});

tokenInfos.push({
  name: "NumberHexadecimalLiteral2",
  pattern: /[0-9][0-9a-f]h/i,
});

tokenInfos.push({
  name: "NumberBinaryLiteral",
  pattern: /0b[01]+/,
});

tokenInfos.push({
  name: "NumberOctalLiteral",
  pattern: /0[0-7]+/,
});

tokenInfos.push({
  name: "NumberDecimalLiteral",
  pattern: /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?[Ll]?/,
});

// Some tokens, with a "longer_alt" attribute set, have to be created after other ones
const createdTokens = {};
_.map(_.filter(tokenInfos, tokenInfo => !_.has(tokenInfo, "longer_alt")), tokenInfo => {
  createdTokens[tokenInfo.name] = createToken(tokenInfo);
});

const remainingTokens = _.filter(tokenInfos, tokenInfo => _.has(tokenInfo, "longer_alt"));
while (!_.isEmpty(remainingTokens)) {
  for (let i = 0; i < remainingTokens.length; i += 1) {
    const remainingToken = remainingTokens[i];
    if (_.has(createdTokens, remainingToken.longer_alt)) {
      // The "longer_alt" references an already created token, so we can create the current one immediately
      remainingToken.longer_alt = createdTokens[remainingToken.longer_alt];
      createdTokens[remainingToken.name] = createToken(remainingToken);
      remainingTokens.splice(i, 1);
      i -= 1;
    }
  }
}

// At this point, all tokens have been created
// But the order or creation (in the "createdTokens" array) is not the correct order of tokens
// So we have to iterate through "tokenInfos" one last time
module.exports = _.fromPairs(_.map(tokenInfos, tokenInfo => [tokenInfo.name, createdTokens[tokenInfo.name]]));
