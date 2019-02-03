"use strict";

const _ = require("lodash");

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
          enumerations: _.map(ctx.enumClause, this.visit.bind(this)),
          bitmasks: _.map(ctx.bitmaskClause, this.visit.bind(this)),
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

      enumClause(ctx) {
        const name = this.getIdentifierName(_.first(ctx.IdentifierToken));
        const entries = _.times(ctx.IdentifierToken.length - 1, i => ({
          key: ctx.IdentifierToken[i + 1],
          value: this.visit(ctx.numberClause[i]),
        }));
        const parentType = this.visit(ctx.typeReferenceClause);
        return {
          name,
          entries,
          parentType,
        };
      }

      bitmaskClause(ctx) {
        const name = this.getIdentifierName(_.first(ctx.IdentifierToken));
        const entries = _.times(ctx.IdentifierToken.length - 1, i => ({
          key: this.getIdentifierName(ctx.IdentifierToken[i + 1]),
          value: this.visit(ctx.numberClause[i]),
        }));
        const parentType = this.visit(ctx.typeReferenceClause);
        return {
          name,
          entries,
          parentType,
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
        const type = this.visit(ctx.typeReferenceClause);
        const name = this.getIdentifierName(_.get(ctx.IdentifierToken, 0));
        const fieldResult = {
          type,
          name,
        };
        if (_.has(ctx, "BoxMemberExpression")) {
          const boxMemberDefinition = this.visit(_.first(ctx.BoxMemberExpression));
          fieldResult.arrayDefinition = boxMemberDefinition.substr(1, boxMemberDefinition.length - 2);
        }
        return fieldResult;
      }

      typeReferenceClause(ctx) {
        const type = this.getIdentifierName(_.get(ctx.IdentifierToken, 0));
        if (_.has(ctx, "ColonToken")) {
          const typeRestriction = this.visit(_.first(ctx.numberClause));
          return {
            type,
            typeRestriction,
          };
        }
        return {
          type,
        };
      }

      valueClause(ctx) {
        if (_.has(ctx, "StringLiteralToken")) {
          return JSON.parse(_.first(ctx.StringLiteralToken).image);
        }
        // That's a number
        return this.visit(_.first(ctx.numberClause));
      }

      BoxMemberExpression(ctx) {
        return `[${this.visit(ctx.Expression)}]`;
      }

      Expression(ctx) {
        if (_.has(ctx, "AssignmentExpression")) {
          return _.join(_.map(ctx.AssignmentExpression, this.visit.bind(this)), ", ");
        }
      }

      AssignmentExpression(ctx) {
        if (_.has(ctx, "QuestionToken")) {
          const ifElseClause = _.map(ctx.AssignmentExpression, this.visit.bind(this)).join(" : ");
          return `${this.visit(ctx.BinaryExpression)} ? ${ifElseClause}`;
        }
        if (_.has(ctx, "BinaryExpression")) {
          return this.visit(ctx.BinaryExpression);
        }
      }

      BinaryExpression(ctx) {
        if (_.has(ctx, "UnaryExpression")) {
          const operator = _.first(_.keys(ctx).filter(key => key !== "UnaryExpression"));
          const expressions = _.map(ctx.UnaryExpression, this.visit.bind(this));
          if (_.isUndefined(operator)) {
            return expressions;
          }
          return _.join(expressions, _.get(_.first(ctx[operator]), "image"));
        }
      }

      UnaryExpression(ctx) {
        if (_.has(ctx, "PostfixExpression")) {
          return this.visit(ctx.PostfixExpression);
        }
        if (_.has(ctx, "DoublePlusToken")) {
          return `++${this.visit(ctx.UnaryExpression)}`;
        }
        if (_.has(ctx, "DoubleMinusToken")) {
          return `--${this.visit(ctx.UnaryExpression)}`;
        }
        if (_.has(ctx, "PlusToken")) {
          return `+${this.visit(ctx.UnaryExpression)}`;
        }
        if (_.has(ctx, "MinusToken")) {
          return `-${this.visit(ctx.UnaryExpression)}`;
        }
        if (_.has(ctx, "TildaToken")) {
          return `~${this.visit(ctx.UnaryExpression)}`;
        }
        if (_.has(ctx, "ExclamationToken")) {
          return `!${this.visit(ctx.UnaryExpression)}`;
        }
      }

      PostfixExpression(ctx) {
        if (_.has(ctx, "MemberCallNewExpression")) {
          const plusPlusSuffix = _.has(ctx, "DoublePlusToken") ? "++" : "";
          const minusMinusSuffix = _.has(ctx, "DoubleMinusToken") ? "--" : "";
          return this.visit(ctx.MemberCallNewExpression) + plusPlusSuffix + minusMinusSuffix;
        }
      }

      MemberCallNewExpression(ctx) {
        if (_.has(ctx, "PrimaryExpression")) {
          return (
            this.visit(ctx.PrimaryExpression) +
            _.join(_.map(ctx.MemberCallNewExpressionExtension, this.visit.bind(this)), "")
          );
        }
      }

      MemberCallNewExpressionExtension(ctx) {
        if (_.has(ctx, "BoxMemberExpression")) {
          return this.visit(ctx.BoxMemberExpression);
        }
        if (_.has(ctx, "DotMemberExpression")) {
          return this.visit(ctx.DotMemberExpression);
        }
        if (_.has(ctx, "Arguments")) {
          return this.visit(ctx.Arguments);
        }
      }

      Arguments(ctx) {
        return `(${_.join(_.map(ctx.AssignmentExpression, this.visit.bind(this)))})`;
      }

      DotMemberExpression(ctx) {
        if (_.has(ctx, "IdentifierToken")) {
          return `.${this.getIdentifierName(_.first(ctx.IdentifierToken))}`;
        }
      }

      PrimaryExpression(ctx) {
        if (_.has(ctx, "numberClause")) {
          return this.visit(_.first(ctx.numberClause));
        }
        if (_.has(ctx, "IdentifierToken")) {
          return this.getIdentifierName(_.first(ctx.IdentifierToken));
        }
        if (_.has(ctx, "ParenthesisExpression")) {
          return this.visit(ctx.ParenthesisExpression);
        }
        if (_.has(ctx, "ArrayLiteral")) {
          return this.visit(ctx.ArrayLiteral);
        }
      }

      ArrayLiteral(ctx) {
        return `[${_.join(_.map(ctx.ArrayLiteralContent, this.visit.bind(this)), "")}]`;
      }

      ArrayLiteralContent(ctx) {
        if (_.has(ctx, "ElementList")) {
          return this.visit(ctx.ElementList);
        }
        if (_.has(ctx, "Elision")) {
          return this.visit(ctx.Elision);
        }
      }

      ElementList(ctx) {
        const firstElement = this.visit(ctx.AssignmentExpression);
        const otherElements = _.join(_.map(ctx.ElementListEntry, this.visit.bind(this)), "");
        return firstElement + otherElements;
      }

      ElementListEntry(ctx) {
        const elision = this.visit(ctx.Elision);
        const entry = this.visit(ctx.AssignmentExpression);
        return elision + entry;
      }

      Elision(ctx) {
        return _.repeat(",", _.size(ctx.CommaToken));
      }

      ParenthesisExpression(ctx) {
        return `(${this.visit(ctx.Expression)})`;
      }

      numberClause(ctx) {
        if (_.has(ctx, "NumberDecimalLiteralToken")) {
          return parseInt(_.first(ctx.NumberDecimalLiteralToken).image, 10);
        }
        if (_.has(ctx, "NumberHexadecimalLiteralToken")) {
          return parseInt(_.first(ctx.NumberHexadecimalLiteralToken).image.substring(2), 16);
        }
        if (_.has(ctx, "NumberBinaryLiteralToken")) {
          return parseInt(_.first(ctx.NumberBinaryLiteralToken).image.substring(2), 2);
        }
      }

      getIdentifierName(identifier) {
        return identifier.image;
      }
    }

    const visitor = new Visitor();
    return visitor.visit(parsingResult);
  }
}

module.exports = DefinitionReader;
