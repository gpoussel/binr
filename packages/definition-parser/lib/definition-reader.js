"use strict";

const _ = require("lodash");
const { DefinitionLexer } = require("./definition-lexer");
const DefinitionParser = require("./definition-parser");

class DefinitionReader {
  readInput(input) {
    if (!_.isString(input)) {
      throw new Error("input must be a string");
    }

    const lexingResult = new DefinitionLexer().tokenize(input);
    if (!_.isEmpty(lexingResult.errors)) {
      throw new Error(`Got an error while lexing input: ${_.first(lexingResult.errors).message}`);
    }

    const parser = new DefinitionParser();
    parser.input = lexingResult.tokens;
    const parsingResult = parser.definition();

    if (!_.isEmpty(parser.errors)) {
      throw new Error(`Got an error while parsing input: ${_.first(parser.errors).message}`);
    }

    class Visitor extends parser.getBaseCstVisitorConstructorWithDefaults() {
      constructor() {
        super();
        this.validateVisitor();
      }

      definition(ctx) {
        return {
          headers: _.map(ctx.headerClause, clause => this.visit(clause)),
          structures: _.map(ctx.structureClause, clause => this.visit(clause)),
        };
      }

      headerClause(ctx) {
        const name = this.getIdentifierName(_.first(ctx.IdentifierToken));
        const value = this.visit(_.first(ctx.valueClause));
        return {
          name,
          value,
        };
      }

      structureClause(ctx) {
        const exported = _.has(ctx, "ExportToken");
        const name = this.getIdentifierName(_.first(ctx.IdentifierToken));
        const fields = ctx.fieldClause.map(clause => this.visit(clause));
        return {
          name,
          exported,
          fields,
        };
      }

      fieldClause(ctx) {
        const type = this.getIdentifierName(_.get(ctx.IdentifierToken, 0));
        const typeRestriction = _.has(ctx, "ColonToken")
          ? this.getNumberValue(_.first(ctx.NumberLiteralToken))
          : undefined;
        const value = _.has(ctx, "EqualsToken") ? this.visit(_.first(ctx.valueClause)) : undefined;
        const name = this.getIdentifierName(_.get(ctx.IdentifierToken, 1));
        return {
          type,
          typeRestriction,
          name,
          value,
        };
      }

      valueClause(ctx) {
        if (_.has(ctx, "StringLiteralToken")) {
          return JSON.parse(_.first(ctx.StringLiteralToken).image);
        }
        throw new Error("Unhandled value type: ", _.keys(ctx));
      }

      getIdentifierName(identifier) {
        return identifier.image;
      }

      getNumberValue(literal) {
        return parseInt(literal.image, 10);
      }
    }

    const visitor = new Visitor();
    return visitor.visit(parsingResult);
  }
}

module.exports = DefinitionReader;
