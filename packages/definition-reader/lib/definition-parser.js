"use strict";

const _ = require("lodash");
const chevrotain = require("chevrotain");
const { tokens } = require("./definition-lexer");

class DefinitionParser extends chevrotain.Parser {
  constructor() {
    super(_.values(tokens), {
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
      $.CONSUME(tokens.DirectiveStartToken);
      $.CONSUME(tokens.IdentifierToken);
      $.SUBRULE($.valueClause);
    });

    $.RULE("structureClause", () => {
      $.OPTION(() => {
        $.CONSUME(tokens.ExportToken);
      });
      $.CONSUME(tokens.StructToken);
      $.CONSUME(tokens.IdentifierToken);
      $.CONSUME(tokens.CurlyBraceOpenToken);
      $.MANY(() => {
        $.SUBRULE($.fieldClause);
      });
      $.CONSUME(tokens.CurlyBraceCloseToken);
    });

    $.RULE("valueClause", () => {
      $.OR([
        {
          ALT: () => $.CONSUME(tokens.StringLiteralToken),
        },
        {
          ALT: () => $.CONSUME(tokens.NumberLiteralToken),
        },
      ]);
    });

    $.RULE("fieldClause", () => {
      $.CONSUME(tokens.IdentifierToken);
      $.OPTION(() => {
        $.CONSUME(tokens.ColonToken);
        $.CONSUME(tokens.NumberLiteralToken);
      });
      $.CONSUME1(tokens.IdentifierToken);
      $.CONSUME(tokens.SemiColonToken);
    });

    this.performSelfAnalysis();
  }
}

module.exports = DefinitionParser;
