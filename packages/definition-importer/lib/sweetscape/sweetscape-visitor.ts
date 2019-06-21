import {
  assign,
  concat,
  each,
  filter,
  find,
  first,
  get,
  has,
  isEmpty,
  join,
  keys,
  last,
  map,
  parseInt,
  size,
} from "lodash";

function getFirstTokenImage(ctx) {
  return first(get(ctx, first(keys(ctx)))).image;
}

function createBinaryExpressions(expressions, operators) {
  if (isEmpty(operators) && size(expressions) === 1) {
    // In that case, we cannot create a binary expression
    // We can just return the only expression provided
    return first(expressions);
  }
  // N expressions and (N - 1) operators
  let currentExpression = first(expressions);
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
  let finalString = first(stringLiteralToken).image;
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
  return first(identifierToken).image;
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
        content: map(ctx.topLevelStatement, this.visit.bind(this)),
      };
    }

    public topLevelStatement(ctx) {
      if (has(ctx, "statement")) {
        // Statement at the top-level
        return this.visit(ctx.statement);
      }
      if (has(ctx, "functionDeclarationStatement")) {
        return this.visit(ctx.functionDeclarationStatement);
      }
      throw new Error();
    }

    public functionDeclarationStatement(ctx) {
      const { typeName, Identifier: identifiers, functionParameterDeclarationList } = ctx;
      const forwardDeclaration = has(ctx, "SemiColon");
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
      if (has(ctx, "typeNameWithoutVoid")) {
        return this.visit(ctx.typeNameWithoutVoid);
      }
      if (has(ctx, "Void")) {
        return {
          name: "void",
        };
      }
      throw new Error();
    }

    public typeNameWithoutVoid(ctx) {
      const simpleName = getIdentifier(ctx.Identifier);
      const nameParts = [];
      if (has(ctx, "Signed")) {
        nameParts.push("signed");
      }
      if (has(ctx, "Unsigned")) {
        nameParts.push("unsigned");
      }
      nameParts.push(simpleName);
      return {
        name: join(nameParts, " "),
        array: has(ctx, "emptyArraySelector"),
      };
    }

    public functionParameterDeclarationList(ctx) {
      if (has(ctx, "Void")) {
        return [];
      }
      return map(ctx.functionParameterDeclaration, this.visit.bind(this));
    }

    public functionParameterDeclaration(ctx) {
      const type = this.visit(ctx.typeNameWithoutVoid);
      if (has(ctx, "anyArraySelector")) {
        assign(type, this.visit(ctx.anyArraySelector));
      }
      const result: any = {
        type,
        reference: has(ctx, "BinaryAnd"),
        name: getIdentifier(ctx.Identifier),
      };
      each(ctx.variableModifier, (modifier) => {
        assign(result, this.visit(modifier));
      });
      return result;
    }

    public block(ctx) {
      return this.visit(ctx.statementList);
    }

    public statement(ctx) {
      const matchingStatementType = filter(
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
        (statementType) => has(ctx, statementType),
      );
      if (isEmpty(matchingStatementType)) {
        // Just a semi-colon
        return { type: "emptyStatement" };
      }
      return this.visit(ctx[matchingStatementType]);
    }

    public returnStatement(ctx) {
      const result: any = {
        type: "returnStatement",
      };
      if (has(ctx, "assignmentExpression")) {
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
        statements: map(ctx.switchBlockStatementGroup, this.visit.bind(this)),
      };
    }

    public switchBlockStatementGroup(ctx) {
      return {
        labels: this.visit(ctx.switchLabels),
        body: this.visit(ctx.statementList),
      };
    }

    public switchLabels(ctx) {
      const stringLiterals = map(ctx.simpleValue, this.visit.bind(this));
      const defaultStatement = has(ctx, "Default") ? [{ type: "defaultStatement" }] : [];
      return concat(stringLiterals, defaultStatement);
    }

    public forStatement(ctx) {
      return {
        type: "forStatement",
        initialization: this.visit(first(ctx.forInitUpdate)),
        increment: this.visit(last(ctx.forInitUpdate)),
        body: this.visit(ctx.statement),
        condition: this.visit(ctx.assignmentExpression),
      };
    }

    public localVariableDeclarationStatement(ctx) {
      const result: any = {
        type: "variableDeclaration",
        variableType: this.visit(ctx.typeName),
        annotations: has(ctx, "annotations") ? this.visit(ctx.annotations) : [],
      };
      each(ctx.variableModifier, (modifier) => {
        assign(result, this.visit(modifier));
      });
      if (has(ctx, "bitfieldRest")) {
        result.bits = this.visit(ctx.bitfieldRest);
      }
      if (has(ctx, "variableDeclarators")) {
        result.declarations = this.visit(ctx.variableDeclarators);
      }
      if (has(ctx, "annotations")) {
        result.annotations = this.visit(ctx.annotations);
      }
      return result;
    }

    public variableDeclarators(ctx) {
      return map(ctx.variableDeclarator, this.visit.bind(this));
    }

    public variableModifier(ctx) {
      if (has(ctx, "Local")) {
        return { local: true };
      }
      if (has(ctx, "Const")) {
        return { const: true };
      }
      throw new Error();
    }

    public typedefStatement(ctx) {
      const result: any = {
        type: "typeAlias",
        name: this.visit(ctx.typeName),
        alias: getIdentifier(ctx.Identifier),
        annotations: has(ctx, "annotations") ? this.visit(ctx.annotations) : [],
      };
      if (has(ctx, "arraySelector")) {
        result.arraySelector = this.visit(ctx.arraySelector);
      }
      return result;
    }

    public statementList(ctx) {
      return {
        type: "statementList",
        statements: map(ctx.statement, this.visit.bind(this)),
      };
    }

    public ifStatement(ctx) {
      const statements = map(ctx.statement, this.visit.bind(this));
      const result: any = {
        type: "ifStatement",
        condition: this.visit(ctx.parExpression),
        trueStatement: first(statements),
      };
      if (size(statements) > 1) {
        [, result.falseStatement] = statements;
      }
      return result;
    }

    public structStatement(ctx) {
      const type = has(ctx, "Struct") ? "structDeclaration" : "unionDeclaration";
      const result: any = {
        type,
      };
      if (has(ctx, "structDeclaration")) {
        result.declaration = this.visit(ctx.structDeclaration);
      }
      assign(result, this.visit(ctx.variableDeclarator));
      if (has(ctx, "Identifier")) {
        result.alias = getIdentifier(ctx.Identifier);
      }
      return result;
    }

    public enumStatement(ctx) {
      const result: any = {
        type: "enumDeclaration",
      };
      if (has(ctx, "typeName")) {
        result.baseType = this.visit(ctx.typeName);
      }
      if (has(ctx, "Identifier")) {
        result.alias = getIdentifier(ctx.Identifier);
      }
      if (has(ctx, "variableDeclarators")) {
        result.declarations = this.visit(ctx.variableDeclarators);
      }
      if (has(ctx, "variableDeclarator")) {
        result.name = this.visit(ctx.variableDeclarator);
      }
      if (has(ctx, "enumDeclaration")) {
        result.declarations = this.visit(ctx.enumDeclaration);
      }
      return result;
    }

    public variableDeclarator(ctx) {
      const result: any = {
        name: getIdentifier(ctx.Identifier),
        annotations: has(ctx, "annotations") ? this.visit(ctx.annotations) : [],
      };
      assign(result, this.visit(ctx.variableDeclaratorRest));
      if (has(ctx, "bitfieldRest")) {
        result.bits = this.visit(ctx.bitfieldRest);
      }
      return result;
    }

    public structDeclaration(ctx) {
      const result: any = {
        body: this.visit(ctx.block),
      };
      if (has(ctx, "functionParameterDeclarationList")) {
        result.parameters = this.visit(ctx.functionParameterDeclarationList);
      }
      return result;
    }

    public variableDeclaratorRest(ctx) {
      const result: any = {};
      if (has(ctx, "annotations")) {
        result.annotations = this.visit(ctx.annotations);
      }
      if (has(ctx, "arguments")) {
        result.arguments = this.visit(ctx.arguments);
      }
      if (has(ctx, "anyArraySelector")) {
        const anyArraySelector = this.visit(ctx.anyArraySelector);
        assign(result, anyArraySelector);
      }
      if (has(ctx, "variableInitializer")) {
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
      const operators = map(ctx.assignmentOperator, this.visit.bind(this));
      const expressions = map(ctx.ternaryExpression, this.visit.bind(this));
      return createBinaryExpressions(expressions, operators);
    }

    public ternaryExpression(ctx) {
      const condition = this.visit(ctx.booleanOrExpression);
      if (has(ctx, "assignmentExpression")) {
        const result: any = {
          type: "ternaryExpression",
          condition,
          trueStatement: this.visit(first(ctx.assignmentExpression)),
        };
        if (has(ctx, "ternaryExpression")) {
          result.falseStatement = this.visit(ctx.ternaryExpression);
        }
        return result;
      }
      // Without ternary operators, the condition is in fact the expression itself
      return condition;
    }

    public booleanOrExpression(ctx) {
      const operators = map(ctx.BooleanOr, (token) => token.image);
      const expressions = map(ctx.booleanAndExpression, this.visit.bind(this));
      return createBinaryExpressions(expressions, operators);
    }

    public booleanAndExpression(ctx) {
      const operators = map(ctx.BooleanAnd, (token) => token.image);
      const expressions = map(ctx.binaryOrExpression, this.visit.bind(this));
      return createBinaryExpressions(expressions, operators);
    }

    public binaryOrExpression(ctx) {
      const operators = map(ctx.BinaryOr, (token) => token.image);
      const expressions = map(ctx.binaryXorExpression, this.visit.bind(this));
      return createBinaryExpressions(expressions, operators);
    }

    public binaryXorExpression(ctx) {
      const operators = map(ctx.BinaryXor, (token) => token.image);
      const expressions = map(ctx.binaryAndExpression, this.visit.bind(this));
      return createBinaryExpressions(expressions, operators);
    }

    public binaryAndExpression(ctx) {
      const operators = map(ctx.BinaryAnd, (token) => token.image);
      const expressions = map(ctx.equalityExpression, this.visit.bind(this));
      return createBinaryExpressions(expressions, operators);
    }

    public equalityExpression(ctx) {
      const operators = map(ctx.equalityOperator, this.visit.bind(this));
      const expressions = map(ctx.relationalExpression, this.visit.bind(this));
      return createBinaryExpressions(expressions, operators);
    }

    public relationalExpression(ctx) {
      const operators = map(ctx.relationalOperator, this.visit.bind(this));
      const expressions = map(ctx.shiftExpression, this.visit.bind(this));
      return createBinaryExpressions(expressions, operators);
    }

    public shiftExpression(ctx) {
      const operators = map(ctx.shiftOperator, this.visit.bind(this));
      const expressions = map(ctx.additiveExpression, this.visit.bind(this));
      return createBinaryExpressions(expressions, operators);
    }

    public additiveExpression(ctx) {
      const operators = map(ctx.additiveOperator, this.visit.bind(this));
      const expressions = map(ctx.multiplicativeExpression, this.visit.bind(this));
      return createBinaryExpressions(expressions, operators);
    }

    public multiplicativeExpression(ctx) {
      const operators = map(ctx.multiplicativeOperator, this.visit.bind(this));
      const expressions = map(ctx.castExpression, this.visit.bind(this));
      return createBinaryExpressions(expressions, operators);
    }

    public castExpression(ctx) {
      if (has(ctx, "castOperation")) {
        return this.visit(ctx.castOperation);
      }
      if (has(ctx, "prefixExpression")) {
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
      if (has(ctx, "postfixExpression")) {
        return this.visit(ctx.postfixExpression);
      }
      if (has(ctx, "prefixOperator")) {
        return {
          type: "prefixExpression",
          expression: this.visit(ctx.castExpression),
          operator: this.visit(ctx.prefixOperator),
        };
      }
      if (has(ctx, "unaryOperator")) {
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
      if (has(ctx, "postfixOperator")) {
        let currentExpression = expression;
        each(map(ctx.postfixOperator, this.visit.bind(this)), (operator) => {
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
      const memberResult: any = this.visit(ctx.memberExpression);
      let currentExpression = memberResult;
      each(ctx.callExpressionRest, (expressionRest) => {
        const { children: expressionRestChildren } = expressionRest;
        if (has(expressionRestChildren, "arguments")) {
          // That's a function call
          currentExpression = {
            type: "functionCallExpression",
            name: currentExpression,
            arguments: this.visit(expressionRestChildren.arguments),
          };
        } else if (has(expressionRestChildren, "arraySelector")) {
          // That's an array index
          currentExpression = {
            type: "arrayIndexExpression",
            expression: currentExpression,
            index: this.visit(expressionRestChildren.arraySelector),
          };
        } else if (has(expressionRestChildren, "propertyAccess")) {
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
      const primaryResult: any = this.visit(ctx.primaryExpression);
      let currentExpression = primaryResult;
      each(ctx.memberExpressionRest, (expressionRest) => {
        const { children: expressionRestChildren } = expressionRest;
        if (has(expressionRestChildren, "arraySelector")) {
          // That's an array index
          currentExpression = {
            type: "arrayIndexExpression",
            expression: currentExpression,
            index: this.visit(expressionRestChildren.arraySelector),
          };
        } else if (has(expressionRestChildren, "propertyAccess")) {
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
      if (has(ctx, "simpleValue")) {
        return this.visit(ctx.simpleValue);
      }
      if (has(ctx, "expressionOrTypeName")) {
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
        { tokenName: "NumberBinaryLiteral", convert: (value) => parseInt(value.substring(2), 2) },
        { tokenName: "NumberOctalLiteral", convert: (value) => parseInt(value, 8) },
        { tokenName: "NumberDecimalLiteral", convert: (value) => parseInt(value, 10) },
        {
          tokenName: "NumberHexadecimalLiteral",
          convert: (value) => parseInt(value.substring(2).replace(/L$/, ""), 16),
        },
        {
          tokenName: "NumberHexadecimalLiteral2",
          convert: (value) => parseInt(value.replace(/h$/, ""), 16),
        },
      ];
      const actualToken = find(tokenDefinitions, (tokenDefinition) => has(ctx, tokenDefinition.tokenName));
      return actualToken.convert(first(ctx[actualToken.tokenName]).image);
    }

    public expressionOrTypeName(ctx) {
      if (has(ctx, "assignmentExpression")) {
        return this.visit(ctx.assignmentExpression);
      }
      if (has(ctx, "typeNameWithoutVoid")) {
        return this.visit(ctx.typeNameWithoutVoid);
      }
      throw new Error();
    }

    public arguments(ctx) {
      return map(ctx.assignmentExpression, this.visit.bind(this));
    }

    public annotations(ctx) {
      return map(ctx.annotation, this.visit.bind(this));
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
        values: map(ctx.assignmentExpression, this.visit.bind(this)),
      };
    }

    public bitfieldRest(ctx) {
      return this.visit(ctx.additiveExpression);
    }

    public enumDeclaration(ctx) {
      return map(ctx.enumElementDeclaration, this.visit.bind(this));
    }

    public enumElementDeclaration(ctx) {
      const result: any = {
        name: getIdentifier(ctx.Identifier),
      };
      if (has(ctx, "assignmentExpression")) {
        result.value = this.visit(ctx.assignmentExpression);
      }
      return result;
    }

    public forInitUpdate(ctx) {
      return {
        type: "commaExpression",
        expressions: map(ctx.assignmentExpression, this.visit.bind(this)),
      };
    }

    public arraySelector(ctx) {
      return this.visit(ctx.assignmentExpression);
    }

    public anyArraySelector(ctx) {
      if (has(ctx, "emptyArraySelector")) {
        return {
          array: true,
        };
      }
      if (has(ctx, "arraySelector")) {
        return {
          array: true,
          arraySelector: this.visit(ctx.arraySelector),
        };
      }
      throw new Error();
    }

    public variableInitializer(ctx) {
      if (has(ctx, "assignmentExpression")) {
        return this.visit(ctx.assignmentExpression);
      }
      if (has(ctx, "arrayInitializer")) {
        return this.visit(ctx.arrayInitializer);
      }
      throw new Error();
    }

    public simpleValue(ctx) {
      if (has(ctx, "number")) {
        return {
          type: "number",
          value: this.visit(ctx.number),
        };
      }
      if (has(ctx, "boolean")) {
        return {
          type: "boolean",
          value: this.visit(ctx.boolean),
        };
      }
      if (has(ctx, "Identifier")) {
        return {
          type: "identifier",
          name: getIdentifier(ctx.Identifier),
        };
      }
      if (has(ctx, "StringLiteral")) {
        return {
          type: "string",
          string: getString(ctx.StringLiteral),
        };
      }
      throw new Error();
    }

    public boolean(ctx) {
      if (has(ctx, "True")) {
        return true;
      }
      if (has(ctx, "False")) {
        return false;
      }
      throw new Error();
    }
  }

  return new Visitor();
}
