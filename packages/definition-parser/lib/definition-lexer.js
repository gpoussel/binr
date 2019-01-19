"use strict";

const _ = require("lodash");
const chevrotain = require("chevrotain");

const { createToken, Lexer } = chevrotain;

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

const NumberLiteralToken = createToken({
  name: "NumberLiteralToken",
  pattern: /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/,
});

const SemiColonToken = createToken({
  name: "SemiColonToken",
  pattern: /;/,
});

const ColonToken = createToken({
  name: "ColonToken",
  pattern: /:/,
});

const DirectiveStartToken = createToken({
  name: "DirectiveStartToken",
  pattern: /#/,
});

const EqualsToken = createToken({
  name: "EqualsToken",
  pattern: /=/,
});

const CurlyBraceOpenToken = createToken({
  name: "CurlyBraceOpenToken",
  pattern: /{/,
});

const CurlyBraceCloseToken = createToken({
  name: "CurlyBraceCloseToken",
  pattern: /}/,
});

const TrueToken = createToken({
  name: "TrueToken",
  pattern: /true/,
});

const FalseToken = createToken({
  name: "FalseToken",
  pattern: /false/,
});

const StructToken = createToken({
  name: "StructToken",
  pattern: /struct/,
});

const ExportToken = createToken({
  name: "ExportToken",
  pattern: /export/,
});

const tokens = {
  // Whitespaces
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
};

class DefinitionLexer extends Lexer {
  constructor() {
    super(_.values(tokens), {
      ensureOptimizations: true,
    });
  }
}

module.exports = {
  DefinitionLexer,
  tokens,
};
