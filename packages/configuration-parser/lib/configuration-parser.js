"use strict";

const _ = require("lodash");
const chevrotain = require("chevrotain");

function ConfigurationParser() {
  // TODO
}

function buildLexerParser() {
  const { createToken, Lexer, Parser } = chevrotain;

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
    pattern: /[a-z_][a-z0-9_]+/i,
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

  class MyParser extends Parser {
    constructor() {
      super(allTokens, {
        recoveryEnabled: true,
      });

      const $ = this;

      $.RULE("definition", () => {
        $.MANY(() => {
          $.SUBRULE($.headerClause);
        });
        $.MANY1(() => {
          $.SUBRULE($.structureClause);
        });
      });

      $.RULE("headerClause", () => {
        $.CONSUME(DirectiveStartToken);
        $.CONSUME(IdentifierToken);
        $.SUBRULE($.valueClause);
      });

      $.RULE("structureClause", () => {
        $.OPTION(() => {
          $.CONSUME(ExportToken);
        });
        $.CONSUME(StructToken);
        $.CONSUME(IdentifierToken);
        $.CONSUME(CurlyBraceOpenToken);
        $.MANY(() => {
          $.SUBRULE($.fieldClause);
        });
        $.CONSUME(CurlyBraceCloseToken);
      });

      $.RULE("valueClause", () => {
        $.OR([
          {
            ALT: () => $.CONSUME(StringLiteralToken),
          },
          {
            ALT: () => $.CONSUME(NumberLiteralToken),
          },
        ]);
      });

      $.RULE("fieldClause", () => {
        $.CONSUME(IdentifierToken);
        $.OPTION(() => {
          $.CONSUME(ColonToken);
          $.CONSUME(NumberLiteralToken);
        });
        $.CONSUME1(IdentifierToken);
        $.OPTION1(() => {
          $.CONSUME(EqualsToken);
          $.SUBRULE($.valueClause);
        });
        $.CONSUME(SemiColonToken);
      });

      this.performSelfAnalysis();
    }
  }

  return {
    lexer: new Lexer(allTokens, {
      ensureOptimizations: true,
    }),
    Parser: MyParser,
  };
}

ConfigurationParser.prototype.parse = input => {
  if (!_.isString(input)) {
    throw new Error("input must be a string");
  }

  const lexerParser = buildLexerParser();
  const lexingResult = lexerParser.lexer.tokenize(input);
  if (!_.isEmpty(lexingResult.errors)) {
    throw new Error(`Got an error while lexing input: ${_.first(lexingResult.errors).message}`);
  }

  const parser = new lexerParser.Parser();
  parser.input = lexingResult.tokens;
  const parsingResult = parser.definition();

  if (!_.isEmpty(parser.errors)) {
    throw new Error(`Got an error while parsing input: ${_.first(parser.errors).message}`);
  }

  return parsingResult;
};

module.exports = ConfigurationParser;
