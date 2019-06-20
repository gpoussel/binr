"use strict";

import _ from "lodash";

function getFirstTokenImage(ctx) {
  return _.first(_.get(ctx, _.first(_.keys(ctx)))).image;
}

function createBinaryExpressions(expressions, operators) {
  if (_.isEmpty(operators) && _.size(expressions) === 1) {
    // In that case, we cannot create a binary expression
    // We can just return the only expression provided
    return _.first(expressions);
  }
  // N expressions and (N - 1) operators
  let currentExpression = _.first(expressions);
  for (let i = 1; i < expressions.length; i += 1) {
    currentExpression = {
      type: "binaryExpression",
      left: currentExpression,
      right: expressions[i],
      operator: operators[i - 1],
    };
  }
  return currentExpression;
}

function getString(stringLiteralToken) {
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

function getIdentifier(identifierToken) {
  return _.first(identifierToken).image;
}

export function getVisitor(parser) {
  class Visitor extends parser.getBaseCstVisitorConstructorWithDefaults() {
    constructor() {
      super();
      this.validateVisitor();
    }

    public definition(ctx) {
      return {
        type: "definition",
        content: _.map(ctx.topLevelStatement, this.visit.bind(this)),
      };
    }

    public topLevelStatement(ctx) {
      if (_.has(ctx, "statement")) {
        // Statement at the top-level
        return this.visit(ctx.statement);
      }
      if (_.has(ctx, "functionDeclarationStatement")) {
        return this.visit(ctx.functionDeclarationStatement);
      }
      throw new Error();
    }

    public functionDeclarationStatement(ctx) {
      const { typeName, Identifier: identifiers, functionParameterDeclarationList } = ctx;
      const forwardDeclaration = _.has(ctx, "SemiColon");
      return {
        type: "functionDeclaration",
        returnType: this.visit(typeName),
        name: getIdentifier(identifiers),
        parameters: this.visit(functionParameterDeclarationList),
        forwardDeclaration,
        content: forwardDeclaration ? {} : this.visit(ctx.block),
      };
    }

    public typeName(ctx) {
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

    public typeNameWithoutVoid(ctx) {
      const simpleName = getIdentifier(ctx.Identifier);
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
        array: _.has(ctx, "emptyArraySelector"),
      };
    }

    public functionParameterDeclarationList(ctx) {
      if (_.has(ctx, "Void")) {
        return [];
      }
      return _.map(ctx.functionParameterDeclaration, this.visit.bind(this));
    }

    public functionParameterDeclaration(ctx) {
      const type = this.visit(ctx.typeNameWithoutVoid);
      if (_.has(ctx, "anyArraySelector")) {
        _.assign(type, this.visit(ctx.anyArraySelector));
      }
      const result = {
        type,
        reference: _.has(ctx, "BinaryAnd"),
        name: getIdentifier(ctx.Identifier),
      };
      _.each(ctx.variableModifier, (modifier) => {
        _.assign(result, this.visit(modifier));
      });
      return result;
    }

    public block(ctx) {
      return this.visit(ctx.statementList);
    }

    public statement(ctx) {
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
        (statementType) => _.has(ctx, statementType),
      );
      if (_.isEmpty(matchingStatementType)) {
        // Just a semi-colon
        return { type: "emptyStatement" };
      }
      return this.visit(ctx[matchingStatementType]);
    }

    public returnStatement(ctx) {
      const result = {
        type: "returnStatement",
      };
      if (_.has(ctx, "assignmentExpression")) {
        result.assignmentExpression = this.visit(ctx.assignmentExpression);
      }
      return result;
    }

    public breakStatement(ctx) {
      return {
        type: "breakStatement",
      };
    }

    public whileStatement(ctx) {
      return {
        type: "whileStatement",
        condition: this.visit(ctx.parExpression),
        body: this.visit(ctx.statement),
      };
    }

    public doWhileStatement(ctx) {
      return {
        type: "doWhileStatement",
        condition: this.visit(ctx.parExpression),
        body: this.visit(ctx.statement),
      };
    }

    public switchStatement(ctx) {
      return {
        type: "switchStatement",
        statements: _.map(ctx.switchBlockStatementGroup, this.visit.bind(this)),
      };
    }

    public switchBlockStatementGroup(ctx) {
      return {
        labels: this.visit(ctx.switchLabels),
        body: this.visit(ctx.statementList),
      };
    }

    public switchLabels(ctx) {
      const stringLiterals = _.map(ctx.simpleValue, this.visit.bind(this));
      const defaultStatement = _.has(ctx, "Default") ? [{ type: "defaultStatement" }] : [];
      return _.concat(stringLiterals, defaultStatement);
    }

    public forStatement(ctx) {
      return {
        type: "forStatement",
        initialization: this.visit(_.first(ctx.forInitUpdate)),
        increment: this.visit(_.last(ctx.forInitUpdate)),
        body: this.visit(ctx.statement),
        condition: this.visit(ctx.assignmentExpression),
      };
    }

    public localVariableDeclarationStatement(ctx) {
      const result = {
        type: "variableDeclaration",
        variableType: this.visit(ctx.typeName),
        annotations: _.has(ctx, "annotations") ? this.visit(ctx.annotations) : [],
      };
      _.each(ctx.variableModifier, (modifier) => {
        _.assign(result, this.visit(modifier));
      });
      if (_.has(ctx, "bitfieldRest")) {
        result.bits = this.visit(ctx.bitfieldRest);
      }
      if (_.has(ctx, "variableDeclarators")) {
        result.declarations = this.visit(ctx.variableDeclarators);
      }
      if (_.has(ctx, "annotations")) {
        result.annotations = this.visit(ctx.annotations);
      }
      return result;
    }

    public variableDeclarators(ctx) {
      return _.map(ctx.variableDeclarator, this.visit.bind(this));
    }

    public variableModifier(ctx) {
      if (_.has(ctx, "Local")) {
        return { local: true };
      }
      if (_.has(ctx, "Const")) {
        return { const: true };
      }
      throw new Error();
    }

    public typedefStatement(ctx) {
      const result = {
        type: "typeAlias",
        name: this.visit(ctx.typeName),
        alias: getIdentifier(ctx.Identifier),
        annotations: _.has(ctx, "annotations") ? this.visit(ctx.annotations) : [],
      };
      if (_.has(ctx, "arraySelector")) {
        result.arraySelector = this.visit(ctx.arraySelector);
      }
      return result;
    }

    public statementList(ctx) {
      return {
        type: "statementList",
        statements: _.map(ctx.statement, this.visit.bind(this)),
      };
    }

    public ifStatement(ctx) {
      const statements = _.map(ctx.statement, this.visit.bind(this));
      const result = {
        type: "ifStatement",
        condition: this.visit(ctx.parExpression),
        trueStatement: _.first(statements),
      };
      if (_.size(statements) > 1) {
        [, result.falseStatement] = statements;
      }
      return result;
    }

    public structStatement(ctx) {
      const type = _.has(ctx, "Struct") ? "structDeclaration" : "unionDeclaration";
      const result = {
        type,
      };
      if (_.has(ctx, "structDeclaration")) {
        result.declaration = this.visit(ctx.structDeclaration);
      }
      _.assign(result, this.visit(ctx.variableDeclarator));
      if (_.has(ctx, "Identifier")) {
        result.alias = getIdentifier(ctx.Identifier);
      }
      return result;
    }

    public enumStatement(ctx) {
      const result = {
        type: "enumDeclaration",
      };
      if (_.has(ctx, "typeName")) {
        result.baseType = this.visit(ctx.typeName);
      }
      if (_.has(ctx, "Identifier")) {
        result.alias = getIdentifier(ctx.Identifier);
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

    public variableDeclarator(ctx) {
      const result = {
        name: getIdentifier(ctx.Identifier),
        annotations: _.has(ctx, "annotations") ? this.visit(ctx.annotations) : [],
      };
      _.assign(result, this.visit(ctx.variableDeclaratorRest));
      if (_.has(ctx, "bitfieldRest")) {
        result.bits = this.visit(ctx.bitfieldRest);
      }
      return result;
    }

    public structDeclaration(ctx) {
      const result = {
        body: this.visit(ctx.block),
      };
      if (_.has(ctx, "functionParameterDeclarationList")) {
        result.parameters = this.visit(ctx.functionParameterDeclarationList);
      }
      return result;
    }

    public variableDeclaratorRest(ctx) {
      const result = {};
      if (_.has(ctx, "annotations")) {
        result.annotations = this.visit(ctx.annotations);
      }
      if (_.has(ctx, "arguments")) {
        result.arguments = this.visit(ctx.arguments);
      }
      if (_.has(ctx, "anyArraySelector")) {
        const anyArraySelector = this.visit(ctx.anyArraySelector);
        _.assign(result, anyArraySelector);
      }
      if (_.has(ctx, "variableInitializer")) {
        result.initializer = this.visit(ctx.variableInitializer);
      }
      return result;
    }

    public expressionStatement(ctx) {
      return this.visit(ctx.assignmentExpression);
    }

    public parExpression(ctx) {
      return this.visit(ctx.assignmentExpression);
    }

    public assignmentExpression(ctx) {
      const operators = _.map(ctx.assignmentOperator, this.visit.bind(this));
      const expressions = _.map(ctx.ternaryExpression, this.visit.bind(this));
      return createBinaryExpressions(expressions, operators);
    }

    public ternaryExpression(ctx) {
      const condition = this.visit(ctx.booleanOrExpression);
      if (_.has(ctx, "assignmentExpression")) {
        const result = {
          type: "ternaryExpression",
          condition,
          trueStatement: this.visit(_.first(ctx.assignmentExpression)),
        };
        if (_.has(ctx, "ternaryExpression")) {
          result.falseStatement = this.visit(ctx.ternaryExpression);
        }
        return result;
      }
      // Without ternary operators, the condition is in fact the expression itself
      return condition;
    }

    public booleanOrExpression(ctx) {
      const operators = _.map(ctx.BooleanOr, (token) => token.image);
      const expressions = _.map(ctx.booleanAndExpression, this.visit.bind(this));
      return createBinaryExpressions(expressions, operators);
    }

    public booleanAndExpression(ctx) {
      const operators = _.map(ctx.BooleanAnd, (token) => token.image);
      const expressions = _.map(ctx.binaryOrExpression, this.visit.bind(this));
      return createBinaryExpressions(expressions, operators);
    }

    public binaryOrExpression(ctx) {
      const operators = _.map(ctx.BinaryOr, (token) => token.image);
      const expressions = _.map(ctx.binaryXorExpression, this.visit.bind(this));
      return createBinaryExpressions(expressions, operators);
    }

    public binaryXorExpression(ctx) {
      const operators = _.map(ctx.BinaryXor, (token) => token.image);
      const expressions = _.map(ctx.binaryAndExpression, this.visit.bind(this));
      return createBinaryExpressions(expressions, operators);
    }

    public binaryAndExpression(ctx) {
      const operators = _.map(ctx.BinaryAnd, (token) => token.image);
      const expressions = _.map(ctx.equalityExpression, this.visit.bind(this));
      return createBinaryExpressions(expressions, operators);
    }

    public equalityExpression(ctx) {
      const operators = _.map(ctx.equalityOperator, this.visit.bind(this));
      const expressions = _.map(ctx.relationalExpression, this.visit.bind(this));
      return createBinaryExpressions(expressions, operators);
    }

    public relationalExpression(ctx) {
      const operators = _.map(ctx.relationalOperator, this.visit.bind(this));
      const expressions = _.map(ctx.shiftExpression, this.visit.bind(this));
      return createBinaryExpressions(expressions, operators);
    }

    public shiftExpression(ctx) {
      const operators = _.map(ctx.shiftOperator, this.visit.bind(this));
      const expressions = _.map(ctx.additiveExpression, this.visit.bind(this));
      return createBinaryExpressions(expressions, operators);
    }

    public additiveExpression(ctx) {
      const operators = _.map(ctx.additiveOperator, this.visit.bind(this));
      const expressions = _.map(ctx.multiplicativeExpression, this.visit.bind(this));
      return createBinaryExpressions(expressions, operators);
    }

    public multiplicativeExpression(ctx) {
      const operators = _.map(ctx.multiplicativeOperator, this.visit.bind(this));
      const expressions = _.map(ctx.castExpression, this.visit.bind(this));
      return createBinaryExpressions(expressions, operators);
    }

    public castExpression(ctx) {
      if (_.has(ctx, "castOperation")) {
        return this.visit(ctx.castOperation);
      }
      if (_.has(ctx, "prefixExpression")) {
        return this.visit(ctx.prefixExpression);
      }
      throw new Error();
    }

    public castOperation(ctx) {
      return {
        type: "castExpression",
        typeName: this.visit(ctx.typeNameWithoutVoid),
        expression: this.visit(ctx.prefixExpression),
      };
    }

    public prefixExpression(ctx) {
      if (_.has(ctx, "postfixExpression")) {
        return this.visit(ctx.postfixExpression);
      }
      if (_.has(ctx, "prefixOperator")) {
        return {
          type: "prefixExpression",
          expression: this.visit(ctx.castExpression),
          operator: this.visit(ctx.prefixOperator),
        };
      }
      if (_.has(ctx, "unaryOperator")) {
        return {
          type: "unaryExpression",
          expression: this.visit(ctx.castExpression),
          operator: this.visit(ctx.unaryOperator),
        };
      }
      throw new Error();
    }

    public postfixExpression(ctx) {
      const expression = this.visit(ctx.callExpression);
      if (_.has(ctx, "postfixOperator")) {
        let currentExpression = expression;
        _.each(_.map(ctx.postfixOperator, this.visit.bind(this)), (operator) => {
          currentExpression = {
            type: "postfixExpression",
            expression: currentExpression,
            operator,
          };
        });
        return currentExpression;
      }
      // Without operator, the expression is the result
      return expression;
    }

    public callExpression(ctx) {
      const memberResult = this.visit(ctx.memberExpression);
      let currentExpression = memberResult;
      _.each(ctx.callExpressionRest, (expressionRest) => {
        const { children: expressionRestChildren } = expressionRest;
        if (_.has(expressionRestChildren, "arguments")) {
          // That's a function call
          currentExpression = {
            type: "functionCallExpression",
            name: currentExpression,
            arguments: this.visit(expressionRestChildren.arguments),
          };
        } else if (_.has(expressionRestChildren, "arraySelector")) {
          // That's an array index
          currentExpression = {
            type: "arrayIndexExpression",
            expression: currentExpression,
            index: this.visit(expressionRestChildren.arraySelector),
          };
        } else if (_.has(expressionRestChildren, "propertyAccess")) {
          currentExpression = {
            type: "propertyAccessExpression",
            expression: currentExpression,
            name: this.visit(expressionRestChildren.propertyAccess),
          };
        } else {
          throw new Error();
        }
      });
      return currentExpression;
    }

    public propertyAccess(ctx) {
      return getIdentifier(ctx.Identifier);
    }

    public memberExpression(ctx) {
      const primaryResult = this.visit(ctx.primaryExpression);
      let currentExpression = primaryResult;
      _.each(ctx.memberExpressionRest, (expressionRest) => {
        const { children: expressionRestChildren } = expressionRest;
        if (_.has(expressionRestChildren, "arraySelector")) {
          // That's an array index
          currentExpression = {
            type: "arrayIndexExpression",
            expression: currentExpression,
            index: this.visit(expressionRestChildren.arraySelector),
          };
        } else if (_.has(expressionRestChildren, "propertyAccess")) {
          currentExpression = {
            type: "propertyAccessExpression",
            expression: currentExpression,
            name: this.visit(expressionRestChildren.propertyAccess),
          };
        } else {
          throw new Error();
        }
      });
      return currentExpression;
    }

    public primaryExpression(ctx) {
      if (_.has(ctx, "simpleValue")) {
        return this.visit(ctx.simpleValue);
      }
      if (_.has(ctx, "expressionOrTypeName")) {
        // Sizeof expression
        return {
          type: "sizeofExpression",
          operand: this.visit(ctx.expressionOrTypeName),
        };
      }
      return this.visit(ctx.parExpression);
    }

    public assignmentOperator(ctx) {
      return getFirstTokenImage(ctx);
    }

    public equalityOperator(ctx) {
      return getFirstTokenImage(ctx);
    }

    public relationalOperator(ctx) {
      return getFirstTokenImage(ctx);
    }

    public shiftOperator(ctx) {
      return getFirstTokenImage(ctx);
    }

    public additiveOperator(ctx) {
      return getFirstTokenImage(ctx);
    }

    public multiplicativeOperator(ctx) {
      return getFirstTokenImage(ctx);
    }

    public prefixOperator(ctx) {
      return getFirstTokenImage(ctx);
    }

    public postfixOperator(ctx) {
      return getFirstTokenImage(ctx);
    }

    public unaryOperator(ctx) {
      return getFirstTokenImage(ctx);
    }

    public number(ctx) {
      const tokenDefinitions = [
        { tokenName: "NumberBinaryLiteral", convert: (value) => _.parseInt(value.substring(2), 2) },
        { tokenName: "NumberOctalLiteral", convert: (value) => _.parseInt(value, 8) },
        { tokenName: "NumberDecimalLiteral", convert: (value) => _.parseInt(value, 10) },
        {
          tokenName: "NumberHexadecimalLiteral",
          convert: (value) => _.parseInt(value.substring(2).replace(/L$/, ""), 16),
        },
        {
          tokenName: "NumberHexadecimalLiteral2",
          convert: (value) => _.parseInt(value.replace(/h$/, ""), 16),
        },
      ];
      const actualToken = _.find(tokenDefinitions, (tokenDefinition) =>
        _.has(ctx, tokenDefinition.tokenName),
      );
      return actualToken.convert(_.first(ctx[actualToken.tokenName]).image);
    }

    public expressionOrTypeName(ctx) {
      if (_.has(ctx, "assignmentExpression")) {
        return this.visit(ctx.assignmentExpression);
      }
      if (_.has(ctx, "typeNameWithoutVoid")) {
        return this.visit(ctx.typeNameWithoutVoid);
      }
      throw new Error();
    }

    public arguments(ctx) {
      return _.map(ctx.assignmentExpression, this.visit.bind(this));
    }

    public annotations(ctx) {
      return _.map(ctx.annotation, this.visit.bind(this));
    }

    public annotation(ctx) {
      return {
        key: getIdentifier(ctx.Identifier),
        value: this.visit(ctx.simpleValue),
      };
    }

    public arrayInitializer(ctx) {
      return {
        type: "arrayDeclaration",
        values: _.map(ctx.assignmentExpression, this.visit.bind(this)),
      };
    }

    public bitfieldRest(ctx) {
      return this.visit(ctx.additiveExpression);
    }

    public enumDeclaration(ctx) {
      return _.map(ctx.enumElementDeclaration, this.visit.bind(this));
    }

    public enumElementDeclaration(ctx) {
      const result = {
        name: getIdentifier(ctx.Identifier),
      };
      if (_.has(ctx, "assignmentExpression")) {
        result.value = this.visit(ctx.assignmentExpression);
      }
      return result;
    }

    public forInitUpdate(ctx) {
      return {
        type: "commaExpression",
        expressions: _.map(ctx.assignmentExpression, this.visit.bind(this)),
      };
    }

    public arraySelector(ctx) {
      return this.visit(ctx.assignmentExpression);
    }

    public anyArraySelector(ctx) {
      if (_.has(ctx, "emptyArraySelector")) {
        return {
          array: true,
        };
      }
      if (_.has(ctx, "arraySelector")) {
        return {
          array: true,
          arraySelector: this.visit(ctx.arraySelector),
        };
      }
      throw new Error();
    }

    public variableInitializer(ctx) {
      if (_.has(ctx, "assignmentExpression")) {
        return this.visit(ctx.assignmentExpression);
      }
      if (_.has(ctx, "arrayInitializer")) {
        return this.visit(ctx.arrayInitializer);
      }
      throw new Error();
    }

    public simpleValue(ctx) {
      if (_.has(ctx, "number")) {
        return {
          type: "number",
          value: this.visit(ctx.number),
        };
      }
      if (_.has(ctx, "boolean")) {
        return {
          type: "boolean",
          value: this.visit(ctx.boolean),
        };
      }
      if (_.has(ctx, "Identifier")) {
        return {
          type: "identifier",
          name: getIdentifier(ctx.Identifier),
        };
      }
      if (_.has(ctx, "StringLiteral")) {
        return {
          type: "string",
          string: getString(ctx.StringLiteral),
        };
      }
      throw new Error();
    }

    public boolean(ctx) {
      if (_.has(ctx, "True")) {
        return true;
      }
      if (_.has(ctx, "False")) {
        return false;
      }
      throw new Error();
    }
  }

  return new Visitor();
}
