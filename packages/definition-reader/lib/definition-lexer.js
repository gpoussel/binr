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

const symbolTokens = _.fromPairs(
  _.map(
    {
      SemiColon: ";",
      Colon: ":",
      DirectiveStart: "#",
      Equals: "=",
      CurlyBraceOpen: "{",
      CurlyBraceClose: "}",
      BracketOpen: "[",
      BracketClose: "]",
      ParenthesisOpen: "(",
      ParenthesisClose: ")",
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
    {
      True: "true",
      False: "false",
      Struct: "struct",
      Export: "export",
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

const tokens = {
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
