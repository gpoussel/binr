"use strict";

const _ = require("lodash");
const chevrotain = require("chevrotain");

function ConfigurationParser() {
  // TODO
}

function buildParser() {
  const { createToken, Lexer } = chevrotain;

  const WhitespaceToken = createToken({
    name: "whitespace",
    pattern: /[ \t\r\n]+/,
    group: Lexer.SKIPPED,
  });

  const SingleLineCommentToken = createToken({
    name: "Single-Line Comment",
    pattern: /\/\/.+/,
    group: "comments",
  });

  const MultiLineCommentToken = createToken({
    name: "Multi-Line Comment",
    pattern: /\/\*[\s\S]+\*\//,
    group: "comments",
  });

  const IdentifierToken = createToken({
    name: "Identifier",
    pattern: /[a-z_][a-z0-9_]+/i,
  });

  const StringLiteralToken = createToken({
    name: "StringLiteral",
    pattern: /"(:?[^\\"\n\r]+|\\(:?[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*"/,
  });

  const NumberLiteralToken = createToken({
    name: "NumberLiteral",
    pattern: /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/,
  });

  const SemiColonToken = createToken({
    pattern: /;/,
    name: "SemiColon",
  });

  const ColonToken = createToken({
    pattern: /:/,
    name: "Colon",
  });

  const DirectiveStartToken = createToken({
    pattern: /#/,
    name: "DirectiveStart",
  });

  const EqualsToken = createToken({
    pattern: /=/,
    name: "Equals",
  });

  const CurlyBraceOpenToken = createToken({
    pattern: /{/,
    name: "CurlyBraceOpen",
  });

  const CurlyBraceCloseToken = createToken({
    pattern: /}/,
    name: "CurlyBraceClose",
  });

  const TrueToken = createToken({
    pattern: /true/,
    name: "True",
  });

  const FalseToken = createToken({
    pattern: /false/,
    name: "False",
  });

  const StructToken = createToken({
    pattern: /struct/,
    name: "Struct",
  });

  const ExportToken = createToken({
    pattern: /export/,
    name: "Export",
  });

  const allTokens = [
    // Whitepsaces
    WhitespaceToken,

    // Comments
    SingleLineCommentToken,
    MultiLineCommentToken,

    // Symbols
    SemiColonToken,
    ColonToken,
    DirectiveStartToken,
    EqualsToken,
    CurlyBraceOpenToken,
    CurlyBraceCloseToken,

    // Keywords
    TrueToken,
    FalseToken,
    StructToken,
    ExportToken,

    // Identifiers
    IdentifierToken,
    StringLiteralToken,
    NumberLiteralToken,
  ];

  return {
    lexer: new Lexer(allTokens, {
      ensureOptimizations: true,
    }),
  };
}

ConfigurationParser.prototype.parse = input => {
  if (!_.isString(input)) {
    throw new Error("input must be a string");
  }

  const parser = buildParser();
  const tokenizeResult = parser.lexer.tokenize(input);
  if (!_.isEmpty(tokenizeResult.errors)) {
    throw new Error(`Got an error while parsing input: ${_.first(tokenizeResult.errors).message}`);
  }
  console.log(tokenizeResult);

  return undefined;
};

module.exports = ConfigurationParser;
