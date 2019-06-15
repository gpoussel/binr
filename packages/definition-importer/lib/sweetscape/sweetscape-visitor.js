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

    returnStatement(ctx) {
      const result = {
        type: "returnStatement",
      };
      if (_.has(ctx, "expression")) {
        result.expression = this.visit(ctx.expression);
      }
      return result;
    }

    breakStatement(ctx) {
      return {
        type: "breakStatement",
      };
    }

    whileStatement(ctx) {
      return {
        type: "whileStatement",
        condition: this.visit(ctx.parExpression),
        body: this.visit(ctx.statement),
      };
    }

    doWhileStatement(ctx) {
      return {
        type: "doWhileStatement",
        condition: this.visit(ctx.parExpression),
        body: this.visit(ctx.statement),
      };
    }

    switchStatement(ctx) {
      return {
        type: "switchStatement",
        statements: _.map(ctx.switchBlockStatementGroup, this.visit.bind(this)),
      };
    }

    switchBlockStatementGroup(ctx) {
      return {
        labels: this.visit(ctx.switchLabels),
        body: this.visit(ctx.statementList),
      };
    }

    switchLabels(ctx) {
      const numbers = _.map(ctx.number, this.visit.bind(this));
      const identifiers = _.map(ctx.Identifier, identifier => this.getIdentifier([identifier]));
      const stringLiterals = _.map(ctx.StringLiteral, literal => this.getString([literal]));
      const defaultStatement = _.has(ctx, "Default") ? [{ type: "defaultStatement" }] : [];
      return _.concat(numbers, identifiers, stringLiterals, defaultStatement);
    }

    forStatement(ctx) {
      const result = {
        type: "forStatement",
        initialization: this.visit(_.first(ctx.forInitUpdate)),
        increment: this.visit(_.last(ctx.forInitUpdate)),
        body: this.visit(ctx.statement),
      };
      if (_.has(ctx, "expression")) {
        result.condition = this.visit(ctx.expression);
      }
      return result;
    }

    localVariableDeclarationStatement(ctx) {
      const result = {
        type: "variableDeclaration",
        variableType: this.visit(ctx.typeName),
        annotations: _.has(ctx.annotations) ? this.visit(ctx.annotations) : [],
      };
      _.each(ctx.variableModifier, modifier => {
        _.assign(result, this.visit(modifier));
      });
      if (_.has(ctx, "bitfieldRest")) {
        result.bits = this.visit(ctx.bitfieldRest);
      }
      if (_.has(ctx, "variableModifiers")) {
        result.modifiers = _.map(ctx.variableModifier, this.visit.bind(this));
      }
      if (_.has(ctx, "variableDeclarators")) {
        result.declarations = this.visit(ctx.variableDeclarators);
      }
      if (_.has(ctx, "annotations")) {
        result.annotations = this.visit(ctx.annotations);
      }
      return result;
    }

    variableDeclarators(ctx) {
      return _.map(ctx.variableDeclarator, this.visit.bind(this));
    }

    variableModifier(ctx) {
      if (_.has(ctx, "Local")) {
        return { local: true };
      }
      if (_.has(ctx, "Const")) {
        return { const: true };
      }
    }

    typedefStatement(ctx) {
      const result = {
        type: "typeAlias",
        name: this.visit(ctx.typeName),
        alias: this.getIdentifier(ctx.Identifier),
        annotations: _.has(ctx.annotations) ? this.visit(ctx.annotations) : [],
      };
      if (_.has(ctx, "selector")) {
        result.selector = this.visit(ctx.selector);
      }
      return result;
    }

    statementList(ctx) {
      return {
        type: "statementList",
        statements: _.map(ctx.statement, this.visit.bind(this)),
      };
    }

    emptyStructStatement(ctx) {
      return {
        type: "structDeclaration",
        name: this.getIdentifier(ctx.Identifier),
      };
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
        declaration: this.visit(ctx.structDeclaration),
      };
      _.assign(result, this.visit(ctx.variableDeclarator));
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
      if (_.has(ctx, "variableDeclarators")) {
        result.declarations = this.visit(ctx.variableDeclarators);
      }
      if (_.has(ctx, "variableDeclarator")) {
        result.name = this.visit(ctx.variableDeclarator);
      }
      if (_.has(ctx, "enumDeclaration")) {
        result.declarations = this.visit(ctx.enumDeclaration);
      }
      return result;
    }

    variableDeclarator(ctx) {
      const result = {
        name: this.getIdentifier(ctx.Identifier),
        annotations: _.has(ctx, "annotations") ? this.visit(ctx.annotations) : [],
      };
      if (_.has(ctx, "variableDeclaratorRest")) {
        _.assign(result, this.visit(ctx.variableDeclaratorRest));
      }
      if (_.has(ctx, "bitfieldRest")) {
        result.bits = this.visit(ctx.bitfieldRest);
      }
      return result;
    }

    structDeclaration(ctx) {
      const result = {
        body: this.visit(ctx.statementList),
      };
      if (_.has(ctx, "functionParameterDeclarationList")) {
        result.parameters = this.visit(ctx.functionParameterDeclarationList);
      }
      return result;
    }

    variableDeclaratorRest(ctx) {
      const result = {};
      if (_.has(ctx, "annotations")) {
        result.annotations = this.visit(ctx.annotations);
      }
      if (_.has(ctx, "arguments")) {
        result.arguments = this.visit(ctx.arguments);
      }
      if (_.has(ctx, "expression")) {
        result.arraySelector = this.visit(ctx.expression);
      }
      if (_.has(ctx, "initializer")) {
        result.initializer = this.visit(ctx.variableInitializer);
      }
      return result;
    }

    expressionStatement(ctx) {
      return this.visit(ctx.expression);
    }

    parExpression(ctx) {
      return this.visit(ctx.expression);
    }

    expression(ctx) {
      if (_.size(ctx.expression1) > 1) {
        const operators = _.map(ctx.assignmentOperator, this.visit.bind(this));
        const expressions = _.map(ctx.expression1, this.visit.bind(this));
        return this.createBinaryExpressions(
          _.first(expressions),
          _.times(operators.length - 1, i => ({
            operator: operators[i],
            expression: expressions[i],
          }))
        );
      }
      return this.visit(_.first(ctx.expression1));
    }

    assignmentOperator(ctx) {
      return this.getFirstTokenImage(ctx);
    }

    prefixOperator(ctx) {
      return this.getFirstTokenImage(ctx);
    }

    infixOperator(ctx) {
      return this.getFirstTokenImage(ctx);
    }

    postfixOperator(ctx) {
      return this.getFirstTokenImage(ctx);
    }

    getFirstTokenImage(ctx) {
      return _.first(_.get(ctx, _.first(_.keys(ctx)))).image;
    }

    expression1(ctx) {
      const result = this.visit(ctx.expression2);
      if (_.has(ctx, "expression1Rest")) {
        const ternaryCondition = this.visit(ctx.expression1Rest);
        return {
          type: "ternaryExpression",
          condition: result,
          trueStatement: ternaryCondition.trueStatement,
          falseStatement: ternaryCondition.falseStatement,
        };
      }
      return result;
    }

    expression1Rest(ctx) {
      return {
        trueStatement: this.visit(ctx.expression),
        falseStatement: this.visit(ctx.expression1),
      };
    }

    expression2(ctx) {
      const result = this.visit(ctx.expression3);
      if (_.has(ctx, "expression2Rest")) {
        const otherExpressions = this.visit(ctx.expression2Rest);
        return this.createBinaryExpressions(result, otherExpressions);
      }
      return result;
    }

    createBinaryExpressions(initialExpression, otherExpressions) {
      let currentExpression = initialExpression;
      for (let i = 0; i < otherExpressions.length; i += 1) {
        currentExpression = {
          type: "binaryExpression",
          left: currentExpression,
          right: otherExpressions[i].expression,
          operator: otherExpressions[i].operator,
        };
      }
      return currentExpression;
    }

    expression3(ctx) {
      if (_.has(ctx, "expression3")) {
        return {
          type: "prefixExpression",
          prefixOperator: this.visit(ctx.prefixOperator),
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
          const expression = _.has(ctx, "selector")
            ? {
                type: "qualifiedExpression",
                selectors: _.map(ctx.selector, this.visit.bind(this)),
                expression: this.visit(ctx.primary),
              }
            : this.visit(ctx.primary);
          return {
            type: "postfixExpression",
            operator: this.visit(ctx.postfixOperator),
            expression,
          };
        }
        if (_.has(ctx, "selector")) {
          return {
            type: "qualifiedExpression",
            selectors: _.map(ctx.selector, this.visit.bind(this)),
            expression: this.visit(ctx.primary),
          };
        }
        return {
          type: "primaryExpression",
          expression: this.visit(ctx.primary),
        };
      }
      throw new Error();
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
      if (_.has(ctx, "parExpressionOrCastExpression")) {
        return this.visit(ctx.parExpressionOrCastExpression);
      }
      throw new Error();
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

    annotations(ctx) {
      return _.map(ctx.annotation, this.visit.bind(this));
    }

    annotation(ctx) {
      const key = this.getIdentifier(ctx.Identifier);
      if (_.has(ctx, "StringLiteral")) {
        return {
          key,
          value: this.getString(ctx.StringLiteral),
        };
      }
      if (_.has(ctx, "number")) {
        return {
          key,
          value: this.visit(ctx.number),
        };
      }
      if (_.size(ctx, "Identifier") > 1) {
        return {
          key,
          value: this.getIdentifier([_.last(ctx.Identifier)]),
        };
      }
      throw new Error();
    }

    arrayInitializer(ctx) {
      return {
        type: "arrayDeclaration",
        values: _.map(ctx.expression, this.visit.bind(this)),
      };
    }

    bitfieldRest(ctx) {
      if (_.has(ctx, "number")) {
        return this.visit(ctx.number);
      }
      const identifierResult = {
        type: "identifier",
        name: this.getIdentifier(ctx.Identifier),
      };
      if (_.has(ctx, "expression2Rest")) {
        return this.createBinaryExpressions(identifierResult, [this.visit(ctx.expression2Rest)]);
      }
      return identifierResult;
    }

    enumDeclaration(ctx) {
      return _.map(ctx.enumElementDeclaration, this.visit.bind(this));
    }

    enumElementDeclaration(ctx) {
      const result = {
        name: this.getIdentifier(ctx.Identifier),
      };
      if (_.has(ctx, "expression")) {
        result.value = this.visit(ctx.expression);
      }
      return result;
    }

    expression2Rest(ctx) {
      return _.map(ctx.infixOperator, (operator, index) => ({
        operator: this.visit(operator),
        expression: this.visit(ctx.expression3[index]),
      }));
    }

    forInitUpdate(ctx) {
      // TODO forInitUpdate
    }

    parExpressionOrCastExpression(ctx) {
      const firstExpression = this.visit(ctx.expressionOrTypeName);
      if (_.has(ctx, "infixOperator")) {
        // That's not a cast
        return this.createBinaryExpressions(
          firstExpression,
          _.concat([
            {
              operator: this.visit(ctx.infixOperator),
              expression: this.visit(ctx.expression),
            },
            this.visit(ctx.expression2Rest),
          ])
        );
      }
      // That's a cast
      return {
        type: "castExpression",
        typeName: firstExpression,
        expression: this.visit(ctx.expression),
      };
    }

    selector(ctx) {
      if (_.has(ctx, "arraySelector")) {
        return this.visit(ctx.arraySelector);
      }
      if (_.has(ctx, "Period")) {
        return {
          type: "qualifiedSelector",
          name: this.getIdentifier(ctx.Identifier),
        };
      }
      throw new Error();
    }

    arraySelector(ctx) {
      return {
        type: "arraySelector",
        expression: this.visit(ctx.expression),
      };
    }

    variableInitializer(ctx) {
      if (_.has(ctx, "expression")) {
        return this.visit(ctx.expression);
      }
      if (_.has(ctx, "arrayInitializer")) {
        return this.visit(ctx.arrayInitializer);
      }
    }

    getString(stringLiteralToken) {
      // We cannot use JSON.parse here, because JSON does not support single-quote delimited strings
      let finalString = _.first(stringLiteralToken).image;
      if (finalString.charAt(0) === "L") {
        // Wide-char strings can start with an L (outside quotes)
        finalString = finalString.substr(1);
      }

      const delimiter = finalString.charAt(0);
      if (delimiter === "'") {
        // In that case, we have to replace \' with '
        finalString = finalString.replace(/\\'/g, "'");
      }
      finalString = finalString.substr(1, finalString.length - 2);
      finalString = finalString.replace(/"/g, '\\"');
      finalString = finalString.replace(/\\(?!")/g, "\\\\");
      try {
        return JSON.parse(`"${finalString}"`);
      } catch (e) {
        throw new Error(`Cannot parse string: ${finalString} (${e.message})`);
      }
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
