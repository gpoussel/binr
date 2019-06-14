"use strict";

const _ = require("lodash");

function getVisitor(parser) {
  class Visitor extends parser.getBaseCstVisitorConstructorWithDefaults() {
    constructor() {
      super();
      this.validateVisitor();
    }

    definition(ctx) {
      return {
        type: "definition",
        content: _.map(ctx.topLevelStatement, this.visit.bind(this)),
      };
    }

    topLevelStatement(ctx) {
      if (_.has(ctx, "statement")) {
        // Statement at the top-level
        return this.visit(ctx.statement);
      }
      if (_.has(ctx, "functionDeclarationStatement")) {
        return this.visit(ctx.functionDeclarationStatement);
      }
      if (_.has(ctx, "emptyStructStatement")) {
        return this.visit(ctx.emptyStructStatement);
      }
      throw new Error();
    }

    functionDeclarationStatement(ctx) {
      const { typeName, Identifier: identifiers, functionParameterDeclarationList } = ctx;
      const forwardDeclaration = _.has(ctx, "SemiColon");
      return {
        type: "functionDeclaration",
        returnType: this.visit(typeName),
        name: this.getIdentifier(identifiers),
        parameters: this.visit(functionParameterDeclarationList),
        forwardDeclaration,
        content: forwardDeclaration ? {} : this.visit(ctx.statementList),
      };
    }

    typeName(ctx) {
      if (_.has(ctx, "typeNameWithoutVoid")) {
        return this.visit(ctx.typeNameWithoutVoid);
      }
      if (_.has(ctx, "Void")) {
        return {
          name: "void",
        };
      }
      throw new Error();
    }

    typeNameWithoutVoid(ctx) {
      const simpleName = this.getIdentifier(ctx.Identifier);
      const nameParts = [];
      if (_.has(ctx, "Signed")) {
        nameParts.push("signed");
      }
      if (_.has(ctx, "Unsigned")) {
        nameParts.push("unsigned");
      }
      nameParts.push(simpleName);
      return {
        name: _.join(nameParts, " "),
        array: _.has(ctx, "BracketOpen"),
      };
    }

    functionParameterDeclarationList(ctx) {
      if (_.has(ctx, "Void")) {
        return [];
      }
      return _.map(ctx.functionParameterDeclaration, this.visit.bind(this));
    }

    functionParameterDeclaration(ctx) {
      const type = this.visit(ctx.typeNameWithoutVoid);
      if (_.has(ctx, "BracketOpen")) {
        type.array = true;
      }
      return {
        type,
        reference: _.has(ctx, "BinaryAnd"),
        name: this.getIdentifier(ctx.Identifier),
      };
    }

    block(ctx) {
      return this.visit(ctx.statementList);
    }

    statement(ctx) {
      // TODO Other kind of statements
      const matchingStatementType = _.filter(
        [
          "block",
          "expressionStatement",
          "localVariableDeclarationStatement",
          "typedefStatement",
          "structStatement",
          "enumStatement",
          "ifStatement",
          "whileStatement",
          "doWhileStatement",
          "forStatement",
          "switchStatement",
          "returnStatement",
          "breakStatement",
        ],
        statementType => _.has(ctx, statementType)
      );
      if (_.isUndefined(matchingStatementType)) {
        // Just a semi-colon
        return { type: "emptyStatement" };
      }
      return this.visit(ctx[matchingStatementType]);
    }

    typedefStatement(ctx) {
      // TODO selector
      // TODO annotations
      return {
        type: "typeAlias",
        name: this.visit(ctx.typeName),
        alias: this.getIdentifier(ctx.Identifier),
      };
    }

    statementList(ctx) {
      return {
        type: "statementList",
        statements: _.map(ctx.statement, this.visit.bind(this)),
      };
    }

    emptyStructStatement(ctx) {
      // TODO
    }

    ifStatement(ctx) {
      const statements = _.map(ctx.statement, this.visit.bind(this));
      const result = {
        type: "ifStatement",
        condition: this.visit(ctx.parExpression),
        trueStatement: _.first(statements),
      };
      if (_.size(statements) > 1) {
        result.falseStatement = _.get(statements, 2);
      }
      return result;
    }

    structStatement(ctx) {
      const type = _.has(ctx, "Struct") ? "structDeclaration" : "unionDeclaration";
      const result = {
        type,
        name: this.visit(ctx.variableDeclarator),
        declaration: this.visit(ctx.structDeclaration),
      };
      if (_.has(ctx, "Identifier")) {
        result.alias = this.getIdentifier(ctx.Identifier);
      }
      return result;
    }

    enumStatement(ctx) {
      const result = {
        type: "enumDeclaration",
      };
      if (_.has(ctx, "typeName")) {
        result.baseType = this.visit(ctx.typeName);
      }
      if (_.has(ctx, "Identifier")) {
        result.alias = this.getIdentifier(ctx.Identifier);
      }
      if (_.has(ctx, "variableDeclarator")) {
        result.name = this.visit(ctx.variableDeclarator);
      }
      if (_.has(ctx, "variableDeclarator")) {
        result.name = this.visit(ctx.variableDeclarator);
      }
      return result;
    }

    variableDeclarator(ctx) {
      const result = {
        name: this.getIdentifier(ctx.Identifier),
      };
      if (_.has(ctx, "variableDeclaratorRest")) {
        _.assign(result, this.visit(ctx.variableDeclaratorRest));
      }
      // TODO bitfieldRest
      // TODO annotations
      return result;
    }

    structDeclaration(ctx) {
      // TODO
    }

    variableDeclaratorRest(ctx) {
      // TODO
    }

    expressionStatement(ctx) {
      return this.visit(ctx.expression);
    }

    parExpression(ctx) {
      return this.visit(ctx.expression);
    }

    expression(ctx) {
      if (_.size(ctx.expression1) > 1) {
        // That's a binary operation (or even larger)
        // TODO
        return {};
      }
      return this.visit(_.first(ctx.expression1));
    }

    expression1(ctx) {
      const result = this.visit(ctx.expression2);
      if (_.has(ctx, "expression1Rest")) {
        // TODO
      }
      return result;
    }

    expression2(ctx) {
      const result = this.visit(ctx.expression3);
      if (_.has(ctx, "expression2Rest")) {
        // TODO
      }
      return result;
    }

    expression3(ctx) {
      if (_.has(ctx, "expression3")) {
        return {
          type: "prefixExpression",
          prefixOperator: undefined,
          expression: this.visit(ctx.expression3),
        };
      }
      if (_.has(ctx, "Sizeof")) {
        return {
          type: "sizeofExpression",
          expression: this.visit(ctx.expressionOrTypeName),
        };
      }
      if (_.has(ctx, "primary")) {
        if (_.has(ctx, "postfixOperator")) {
          return {
            type: "postfixExpression",
            expression: this.visit(ctx.primary),
            // TODO postfixOperator
            // TODO selector
          };
        }
        return {
          type: "primaryExpression",
          expression: this.visit(ctx.primary),
        };
      }
    }

    primary(ctx) {
      if (_.has(ctx, "Identifier")) {
        // That's either a single identifier, a function call, or something
        if (_.has(ctx, "identifierSuffix")) {
          return {
            type: "functionCall",
            name: this.getIdentifier(ctx.Identifier),
            arguments: this.visit(ctx.identifierSuffix),
          };
        }
        return {
          type: "identifier",
          name: this.getIdentifier(ctx.Identifier),
        };
      }
      if (_.has(ctx, "StringLiteral")) {
        return {
          type: "stringLiteral",
          string: this.getString(ctx.StringLiteral),
        };
      }
      if (_.has(ctx, "number")) {
        return {
          type: "number",
          value: this.visit(ctx.number),
        };
      }
      // TODO parExpressionOrCastExpression
    }

    number(ctx) {
      const tokenDefinitions = [
        { tokenName: "NumberBinaryLiteral", convert: value => _.parseInt(value.substring(2), 2) },
        { tokenName: "NumberOctalLiteral", convert: value => _.parseInt(value, 8) },
        { tokenName: "NumberDecimalLiteral", convert: value => _.parseInt(value, 10) },
        {
          tokenName: "NumberHexadecimalLiteral",
          convert: value => _.parseInt(value.substring(2).replace(/L$/, ""), 16),
        },
        {
          tokenName: "NumberHexadecimalLiteral2",
          convert: value => _.parseInt(value.replace(/h$/, ""), 16),
        },
      ];
      const actualToken = _.find(tokenDefinitions, tokenDefinition => _.has(ctx, tokenDefinition.tokenName));
      return actualToken.convert(_.first(ctx[actualToken.tokenName]).image);
    }

    expressionOrTypeName(ctx) {
      if (_.has(ctx, "expression")) {
        return this.visit(ctx.expression);
      }
      if (_.has(ctx, "typeNameWithoutVoid")) {
        return this.visit(ctx.typeNameWithoutVoid);
      }
    }

    identifierSuffix(ctx) {
      return this.visit(ctx.arguments);
    }

    arguments(ctx) {
      return _.map(ctx.expression, this.visit.bind(this));
    }

    getString(stringLiteralToken) {
      return JSON.parse(_.first(stringLiteralToken).image);
    }

    getIdentifier(identifierToken) {
      return _.first(identifierToken).image;
    }
  }

  return new Visitor();
}
module.exports = {
  getVisitor,
};
