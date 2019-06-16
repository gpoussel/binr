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
      if (_.has(ctx, "assignmentExpression")) {
        result.assignmentExpression = this.visit(ctx.assignmentExpression);
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
      if (_.has(ctx, "assignmentExpression")) {
        result.condition = this.visit(ctx.assignmentExpression);
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
      if (_.has(ctx, "assignmentExpression")) {
        result.arraySelector = this.visit(ctx.assignmentExpression);
      }
      if (_.has(ctx, "initializer")) {
        result.initializer = this.visit(ctx.variableInitializer);
      }
      return result;
    }

    expressionStatement(ctx) {
      return this.visit(ctx.assignmentExpression);
    }

    parExpression(ctx) {
      return this.visit(ctx.assignmentExpression);
    }

    assignmentExpression(ctx) {
      if (_.size(ctx.ternaryExpression) > 1) {
        const operators = _.map(ctx.assignmentOperator, this.visit.bind(this));
        const expressions = _.map(ctx.ternaryExpression, this.visit.bind(this));
        return this.createBinaryExpressions(
          _.first(expressions),
          _.times(operators.length - 1, i => ({
            operator: operators[i],
            expression: expressions[i],
          }))
        );
      }
      return this.visit(_.first(ctx.ternaryExpression));
    }

    ternaryExpression(ctx) {
      const result = this.visit(ctx.booleanOrExpression);
      if (_.has(ctx, "assignmentExpression")) {
        return {
          type: "ternaryExpression",
          condition: result,
          trueStatement: this.visit(_.first(ctx.assignmentExpression)),
          falseStatement: this.visit(_.last(ctx.ternaryExpression)),
        };
      }
      return result;
    }

    booleanOrExpression(ctx) {
      if (_.size(ctx.booleanAndExpression) > 1) {
        // TODO booleanOrExpression
      }
      return this.visit(_.first(ctx.booleanAndExpression));
    }

    booleanAndExpression(ctx) {
      if (_.size(ctx.binaryOrExpression) > 1) {
        // TODO booleanAndExpression
      }
      return this.visit(_.first(ctx.binaryOrExpression));
    }

    binaryOrExpression(ctx) {
      if (_.size(ctx.binaryXorExpression) > 1) {
        // TODO binaryOrExpression
      }
      return this.visit(_.first(ctx.binaryXorExpression));
    }

    binaryXorExpression(ctx) {
      if (_.size(ctx.binaryAndExpression) > 1) {
        // TODO binaryXorExpression
      }
      return this.visit(_.first(ctx.binaryAndExpression));
    }

    binaryAndExpression(ctx) {
      if (_.size(ctx.equalityExpression) > 1) {
        // TODO binaryAndExpression
      }
      return this.visit(_.first(ctx.equalityExpression));
    }

    equalityExpression(ctx) {
      if (_.size(ctx.relationalExpression) > 1) {
        // TODO equalityExpression
      }
      return this.visit(_.first(ctx.relationalExpression));
    }

    relationalExpression(ctx) {
      if (_.size(ctx.shiftExpression) > 1) {
        // TODO relationalExpression
      }
      return this.visit(_.first(ctx.shiftExpression));
    }

    shiftExpression(ctx) {
      if (_.size(ctx.additiveExpression) > 1) {
        // TODO shiftExpression
      }
      return this.visit(_.first(ctx.additiveExpression));
    }

    additiveExpression(ctx) {
      if (_.size(ctx.multiplicativeExpression) > 1) {
        // TODO additiveExpression
      }
      return this.visit(_.first(ctx.multiplicativeExpression));
    }

    multiplicativeExpression(ctx) {
      if (_.size(ctx.castExpression) > 1) {
        // TODO multiplicativeExpression
      }
      return this.visit(_.first(ctx.castExpression));
    }

    castExpression(ctx) {
      if (_.has(ctx, "castOperation")) {
        return this.visit(ctx.castOperation);
      }
      if (_.has(ctx, "prefixExpression")) {
        return this.visit(ctx.prefixExpression);
      }
    }

    castOperation(ctx) {
      // TODO castOperation
    }

    prefixExpression(ctx) {
      if (_.has(ctx, "postfixExpression")) {
        return this.visit(ctx.postfixExpression);
      }
      // TODO prefixExpression
    }

    postfixExpression(ctx) {
      // TODO postfixExpression
      return this.visit(ctx.callExpression);
    }

    callExpression(ctx) {
      // TODO callExpression
      return this.visit(ctx.memberExpression);
    }

    memberExpression(ctx) {
      // TODO memberExpression
      return this.visit(ctx.primaryExpression);
    }

    primaryExpression(ctx) {
      if (_.has(ctx, "number")) {
        return this.visit(ctx.number);
      }
      if (_.has(ctx, "Identifier")) {
        return this.getIdentifier(ctx.Identifier);
      }
      if (_.has(ctx, "StringLiteral")) {
        return this.getString(ctx.StringLiteral);
      }
    }

    assignmentOperator(ctx) {
      return this.getFirstTokenImage(ctx);
    }

    getFirstTokenImage(ctx) {
      return _.first(_.get(ctx, _.first(_.keys(ctx)))).image;
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
      if (_.has(ctx, "assignmentExpression")) {
        return this.visit(ctx.assignmentExpression);
      }
      if (_.has(ctx, "typeNameWithoutVoid")) {
        return this.visit(ctx.typeNameWithoutVoid);
      }
    }

    identifierSuffix(ctx) {
      return this.visit(ctx.arguments);
    }

    arguments(ctx) {
      return _.map(ctx.assignmentExpression, this.visit.bind(this));
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
        values: _.map(ctx.assignmentExpression, this.visit.bind(this)),
      };
    }

    bitfieldRest(ctx) {
      return this.visit(ctx.additiveExpression);
    }

    enumDeclaration(ctx) {
      return _.map(ctx.enumElementDeclaration, this.visit.bind(this));
    }

    enumElementDeclaration(ctx) {
      const result = {
        name: this.getIdentifier(ctx.Identifier),
      };
      if (_.has(ctx, "assignmentExpression")) {
        result.value = this.visit(ctx.assignmentExpression);
      }
      return result;
    }

    forInitUpdate(ctx) {
      // TODO forInitUpdate
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
        expression: this.visit(ctx.assignmentExpression),
      };
    }

    variableInitializer(ctx) {
      if (_.has(ctx, "assignmentExpression")) {
        return this.visit(ctx.assignmentExpression);
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
