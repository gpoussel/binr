"use strict";

const _ = require("lodash");
const assert = require("assert");

const { DefinitionLexer } = require("./definition-lexer");
const DefinitionParser = require("./definition-parser");
const DefinitionValidator = require("./definition-validator");
const DefinitionBuilder = require("./definition-builder");

class DefinitionReader {
  constructor() {
    this.lexer = new DefinitionLexer();
    this.validator = new DefinitionValidator();
    this.builder = new DefinitionBuilder();
  }

  readInput(input) {
    const ast = this.readAst(input);
    this.validator.validate(ast);
    return this.builder.build(ast);
  }

  readAst(input) {
    if (!_.isString(input)) {
      throw new Error("input must be a string");
    }

    const lexingResult = this.lexer.tokenize(input);
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
          headers: _.map(ctx.headerClause, this.visit.bind(this)),
          structures: _.map(ctx.structureClause, this.visit.bind(this)),
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
        const fields = _.map(ctx.fieldClause, this.visit.bind(this));
        return {
          name,
          exported,
          fields,
        };
      }

      fieldClause(ctx) {
        const type = this.getIdentifierName(_.get(ctx.IdentifierToken, 0));
        const name = this.getIdentifierName(_.get(ctx.IdentifierToken, 1));
        const fieldResult = {
          type,
          name,
        };
        if (_.has(ctx, "ColonToken")) {
          fieldResult.typeRestriction = this.getNumberValue(_.first(ctx.NumberLiteralToken));
        }
        if (_.has(ctx, "BoxMemberExpression")) {
          fieldResult.arrayDefinition = this.visit(ctx.BoxMemberExpression);
        }
        return fieldResult;
      }

      valueClause(ctx) {
        if (_.has(ctx, "StringLiteralToken")) {
          return JSON.parse(_.first(ctx.StringLiteralToken).image);
        }
        // That's a NumberLiteralToken
        return parseInt(_.first(ctx.NumberLiteralToken).image, 10);
      }

      BoxMemberExpression(ctx) {
        // Number represents the array size
        return this.visit(ctx.Expression);
      }

      Expression(ctx) {
        if (_.has(ctx, "AssignmentExpression")) {
          return this.visit(ctx.AssignmentExpression);
        }
        assert(false, `Unexpected context: ${_.keys(ctx)}`);
      }

      AssignmentExpression(ctx) {
        if (_.has(ctx, "BinaryExpression")) {
          return this.visit(ctx.BinaryExpression);
        }
        assert(false, `Unexpected context: ${_.keys(ctx)}`);
      }

      BinaryExpression(ctx) {
        if (_.has(ctx, "UnaryExpression")) {
          return this.visit(ctx.UnaryExpression);
        }
        assert(false, `Unexpected context: ${_.keys(ctx)}`);
      }

      UnaryExpression(ctx) {
        if (_.has(ctx, "PostfixExpression")) {
          return this.visit(ctx.PostfixExpression);
        }
        assert(false, `Unexpected context: ${_.keys(ctx)}`);
      }

      PostfixExpression(ctx) {
        if (_.has(ctx, "MemberCallNewExpression")) {
          return this.visit(ctx.MemberCallNewExpression);
        }
        assert(false, `Unexpected context: ${_.keys(ctx)}`);
      }

      MemberCallNewExpression(ctx) {
        if (_.has(ctx, "PrimaryExpression")) {
          return this.visit(ctx.PrimaryExpression);
        }
        assert(false, `Unexpected context: ${_.keys(ctx)}`);
      }

      PrimaryExpression(ctx) {
        if (_.has(ctx, "NumberLiteralToken")) {
          return this.getNumberValue(_.first(ctx.NumberLiteralToken));
        }
        if (_.has(ctx, "IdentifierToken")) {
          return this.getIdentifierName(_.first(ctx.IdentifierToken));
        }
        if (_.has(ctx, "ParenthesisExpression")) {
          return this.visit(ctx.ParenthesisExpression);
        }
        assert(false, `Unexpected context: ${_.keys(ctx)}`);
      }

      ParenthesisExpression(ctx) {
        return this.visit(ctx.Expression);
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
