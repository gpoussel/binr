import { CstParser } from "chevrotain";
import { assign, concat, each, first, get, has, isEmpty, keys, map, parseInt, size } from "lodash";
import {
  Annotation,
  BinaryExpression,
  BlockStatement,
  BooleanValue,
  CastExpression,
  Definition,
  EmptyStatement,
  Expression,
  ExpressionStatement,
  IdentifierValue,
  NamedType,
  NumberValue,
  Operator,
  PostfixExpression,
  PrefixExpression,
  SizeofExpression,
  Statement,
  StringValue,
  TernaryExpression,
  Type,
  TypeModifier,
  UnaryExpression,
  Value,
  VariableDeclarationStatement,
  VariableModifier,
  VoidType,
} from "../common/nodes";

const OPERATORS = {
  BinaryAnd: Operator.BINARY_AND,
  BinaryAndEquals: Operator.BINARY_AND_EQUALS,
  BinaryOr: Operator.BINARY_OR,
  BinaryOrEquals: Operator.BINARY_OR_EQUALS,
  BinaryXor: Operator.BINARY_XOR,
  BinaryXorEquals: Operator.BINARY_XOR_EQUALS,
  BooleanAnd: Operator.BOOLEAN_AND,
  BooleanOr: Operator.BOOLEAN_OR,
  Different: Operator.DIFFERENT,
  Division: Operator.DIVISION,
  DivisionEquals: Operator.DIVISION_EQUALS,
  DoubleArrow: Operator.DOUBLE_ARROW,
  DoubleEquals: Operator.DOUBLE_EQUALS,
  DoubleMinus: Operator.DOUBLE_MINUS,
  DoublePlus: Operator.DOUBLE_PLUS,
  Equals: Operator.EQUALS,
  Exclamation: Operator.EXCLAMATION,
  Greater: Operator.GREATER,
  GreaterOrEqual: Operator.GREATER_OR_EQUAL,
  Less: Operator.LESS,
  LessOrEqual: Operator.LESS_OR_EQUAL,
  Minus: Operator.MINUS,
  MinusEquals: Operator.MINUS_EQUALS,
  Modulo: Operator.MODULO,
  ModuloEquals: Operator.MODULO_EQUALS,
  Multiplication: Operator.MULTIPLICATION,
  MultiplicationEquals: Operator.MULTIPLICATION_EQUALS,
  Plus: Operator.PLUS,
  PlusEquals: Operator.PLUS_EQUALS,
  ShiftLeft: Operator.SHIFT_LEFT,
  ShiftLeftEquals: Operator.SHIFT_LEFT_EQUALS,
  ShiftRight: Operator.SHIFT_RIGHT,
  ShiftRightEquals: Operator.SHIFT_RIGHT_EQUALS,
  Tilda: Operator.TILDA,
  UnsignedShiftRight: Operator.UNSIGNED_SHIFT_RIGHT,
  UnsignedShiftRightEquals: Operator.UNSIGNED_SHIFT_RIGHT_EQUALS,
};

function getOperator(ctx: any): Operator {
  return get(OPERATORS, keys(ctx)[0]);
}

function createBinaryExpressions(expressions: Expression[], operators: Operator[]): Expression {
  if (isEmpty(operators) && size(expressions) === 1) {
    // In that case, we cannot create a binary expression
    // We can just return the only expression provided
    return expressions[0];
  }
  // N expressions and (N - 1) operators
  let currentExpression: Expression = expressions[0];
  for (let i = 1; i < expressions.length; i++) {
    currentExpression = new BinaryExpression(currentExpression, expressions[i], operators[i - 1]);
  }
  return currentExpression;
}

function getString(stringLiteralToken: any[]) {
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

function getIdentifier(identifierToken: any[]) {
  return first(identifierToken).image;
}

export function getVisitor(parser: CstParser) {
  class Visitor extends parser.getBaseCstVisitorConstructorWithDefaults() {
    constructor() {
      super();
      this.validateVisitor();
    }

    public definition(ctx: any): Definition {
      return new Definition(this.visitAll(ctx, "topLevelStatement"));
    }

    public topLevelStatement(ctx: any): Statement {
      return this.visitFirst(ctx, "statement", "functionDeclarationStatement");
    }

    public functionDeclarationStatement(ctx: any) {
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

    public typeName(ctx: any): Type {
      return this.visitChoices(ctx, [
        { name: "typeNameWithoutVoid", build: () => this.visit(ctx.typeNameWithoutVoid) },
        {
          name: "Void",
          build: () => new VoidType(),
        },
      ]);
    }

    public typeNameWithoutVoid(ctx: any): NamedType {
      const simpleName = getIdentifier(ctx.Identifier);
      const modifiers: TypeModifier[] = [];
      if (has(ctx, "Signed")) {
        modifiers.push(TypeModifier.SIGNED);
      }
      if (has(ctx, "Unsigned")) {
        modifiers.push(TypeModifier.UNSIGNED);
      }
      const array: boolean = has(ctx, "emptyArraySelector");
      return new NamedType(simpleName, modifiers, array);
    }

    public functionParameterDeclarationList(ctx: any) {
      if (has(ctx, "Void")) {
        return [];
      }
      return this.visitAll(ctx, "functionParameterDeclaration");
    }

    public functionParameterDeclaration(ctx: any) {
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

    public block(ctx: any): BlockStatement {
      return new BlockStatement(this.visit(ctx.statementList));
    }

    public statement(ctx: any) {
      return this.visitFirst(
        ctx,
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
        "emptyStatement",
      );
    }

    public returnStatement(ctx: any) {
      const result: any = {
        type: "returnStatement",
      };
      if (has(ctx, "assignmentExpression")) {
        result.assignmentExpression = this.visit(ctx.assignmentExpression);
      }
      return result;
    }

    public breakStatement() {
      return {
        type: "breakStatement",
      };
    }

    public emptyStatement(): EmptyStatement {
      return new EmptyStatement();
    }

    public whileStatement(ctx: any) {
      return {
        type: "whileStatement",
        condition: this.visit(ctx.parExpression),
        body: this.visit(ctx.statement),
      };
    }

    public doWhileStatement(ctx: any) {
      return {
        type: "doWhileStatement",
        condition: this.visit(ctx.parExpression),
        body: this.visit(ctx.statement),
      };
    }

    public switchStatement(ctx: any) {
      return {
        type: "switchStatement",
        statements: this.visitAll(ctx, "switchBlockStatementGroup"),
      };
    }

    public switchBlockStatementGroup(ctx: any) {
      return {
        labels: this.visit(ctx.switchLabels),
        body: this.visit(ctx.statementList),
      };
    }

    public switchLabels(ctx: any) {
      const stringLiterals = this.visitAll(ctx, "simpleValue");
      const defaultStatement = has(ctx, "Default") ? [{ type: "defaultStatement" }] : [];
      return concat(stringLiterals, defaultStatement);
    }

    public forStatement(ctx: any) {
      return {
        type: "forStatement",
        initialization: this.visit(ctx.forInitUpdate[0]),
        increment: this.visit(ctx.forInitUpdate[1]),
        body: this.visit(ctx.statement),
        condition: this.visit(ctx.assignmentExpression),
      };
    }

    public localVariableDeclarationStatement(ctx: any): VariableDeclarationStatement {
      return new VariableDeclarationStatement(
        this.visit(ctx.typeName),
        this.visitAll(ctx, "variableModifier"),
        this.visitIfPresent(ctx, "bitfieldRest"),
        this.visitIfPresent(ctx, "variableDeclarators"),
        this.visitIfPresent(ctx, "annotations", []),
      );
    }

    public variableDeclarators(ctx: any) {
      return this.visitAll(ctx, "variableDeclarator");
    }

    public variableModifier(ctx: any): VariableModifier {
      return this.visitChoices(ctx, [
        { name: "Local", build: () => VariableModifier.LOCAL },
        { name: "Const", build: () => VariableModifier.CONST },
      ]);
    }

    public typedefStatement(ctx: any) {
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

    public statementList(ctx: any): Statement[] {
      return this.visitAll(ctx, "statement");
    }

    public ifStatement(ctx: any) {
      const statements = this.visitAll(ctx, "statement");
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

    public structStatement(ctx: any) {
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

    public enumStatement(ctx: any) {
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

    public variableDeclarator(ctx: any) {
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

    public structDeclaration(ctx: any) {
      const result: any = {
        body: this.visit(ctx.block),
      };
      if (has(ctx, "functionParameterDeclarationList")) {
        result.parameters = this.visit(ctx.functionParameterDeclarationList);
      }
      return result;
    }

    public variableDeclaratorRest(ctx: any) {
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

    public expressionStatement(ctx: any): ExpressionStatement {
      return new ExpressionStatement(this.visit(ctx.assignmentExpression));
    }

    public parExpression(ctx: any): Expression {
      return this.visit(ctx.assignmentExpression);
    }

    public assignmentExpression(ctx: any): Expression {
      const expressions = this.visitAll(ctx, "ternaryExpression");
      const operators = this.visitAll(ctx, "assignmentOperator");
      return createBinaryExpressions(expressions, operators);
    }

    public ternaryExpression(ctx: any): Expression {
      const condition = this.visit(ctx.booleanOrExpression);
      if (!has(ctx, "assignmentExpression")) {
        // Without ternary operators, the condition is in fact the expression itself
        return condition;
      }
      const trueExpression = this.visit(ctx.assignmentExpression[0]);
      if (!has(ctx, "ternaryExpression")) {
        return new TernaryExpression(condition, trueExpression);
      }
      const falseExpression = this.visit(ctx.ternaryExpression);
      return new TernaryExpression(condition, trueExpression, falseExpression);
    }

    public booleanOrExpression(ctx: any): Expression {
      const expressions = this.visitAll(ctx, "booleanAndExpression");
      const operators = map(ctx.BooleanOr, () => Operator.BOOLEAN_OR);
      return createBinaryExpressions(expressions, operators);
    }

    public booleanAndExpression(ctx: any): Expression {
      const expressions = this.visitAll(ctx, "binaryOrExpression");
      const operators = map(ctx.BooleanAnd, () => Operator.BOOLEAN_AND);
      return createBinaryExpressions(expressions, operators);
    }

    public binaryOrExpression(ctx: any): Expression {
      const expressions = this.visitAll(ctx, "binaryXorExpression");
      const operators = map(ctx.BinaryOr, () => Operator.BINARY_OR);
      return createBinaryExpressions(expressions, operators);
    }

    public binaryXorExpression(ctx: any): Expression {
      const expressions = this.visitAll(ctx, "binaryAndExpression");
      const operators = map(ctx.BinaryXor, () => Operator.BINARY_XOR);
      return createBinaryExpressions(expressions, operators);
    }

    public binaryAndExpression(ctx: any): Expression {
      const expressions = this.visitAll(ctx, "equalityExpression");
      const operators = map(ctx.BinaryAnd, () => Operator.BINARY_AND);
      return createBinaryExpressions(expressions, operators);
    }

    public equalityExpression(ctx: any): Expression {
      const expressions = this.visitAll(ctx, "relationalExpression");
      const operators = this.visitAll(ctx, "equalityOperator");
      return createBinaryExpressions(expressions, operators);
    }

    public relationalExpression(ctx: any): Expression {
      const expressions = this.visitAll(ctx, "shiftExpression");
      const operators = this.visitAll(ctx, "relationalOperator");
      return createBinaryExpressions(expressions, operators);
    }

    public shiftExpression(ctx: any): Expression {
      const expressions = this.visitAll(ctx, "additiveExpression");
      const operators = this.visitAll(ctx, "shiftOperator");
      return createBinaryExpressions(expressions, operators);
    }

    public additiveExpression(ctx: any): Expression {
      const expressions = this.visitAll(ctx, "multiplicativeExpression");
      const operators = this.visitAll(ctx, "additiveOperator");
      return createBinaryExpressions(expressions, operators);
    }

    public multiplicativeExpression(ctx: any): Expression {
      const expressions = this.visitAll(ctx, "castExpression");
      const operators = this.visitAll(ctx, "multiplicativeOperator");
      return createBinaryExpressions(expressions, operators);
    }

    public castExpression(ctx: any): Expression {
      return this.visitFirst(ctx, "castOperation", "prefixExpression");
    }

    public castOperation(ctx: any): CastExpression {
      return new CastExpression(this.visit(ctx.prefixExpression), this.visit(ctx.typeNameWithoutVoid));
    }

    public prefixExpression(ctx: any): Expression {
      return this.visitChoices(ctx, [
        { name: "postfixExpression", build: () => this.visit(ctx.postfixExpression) },
        {
          name: "prefixOperator",
          build: () => new PrefixExpression(this.visit(ctx.prefixExpression), this.visit(ctx.prefixOperator)),
        },
        {
          name: "unaryOperator",
          build: () => new UnaryExpression(this.visit(ctx.castExpression), this.visit(ctx.unaryOperator)),
        },
      ]);
    }

    public postfixExpression(ctx: any): Expression {
      const expression = this.visit(ctx.callExpression);
      if (!has(ctx, "postfixOperator")) {
        // Without operator, the expression is the result
        return expression;
      }
      let currentExpression = expression;
      each(this.visitAll(ctx, "postfixOperator"), (operator) => {
        currentExpression = new PostfixExpression(currentExpression, operator);
      });
      return currentExpression;
    }

    public callExpression(ctx: any) {
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

    public propertyAccess(ctx: any) {
      return getIdentifier(ctx.Identifier);
    }

    public memberExpression(ctx: any) {
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

    public primaryExpression(ctx: any) {
      return this.visitChoices(ctx, [
        { name: "simpleValue", build: () => this.visit(ctx.simpleValue) },
        {
          name: "expressionOrTypeName",
          build: () => new SizeofExpression(this.visit(ctx.expressionOrTypeName)),
        },
        { name: "parExpression", build: () => this.visit(ctx.parExpression) },
      ]);
    }

    public assignmentOperator(ctx: any): Operator {
      return getOperator(ctx);
    }

    public equalityOperator(ctx: any): Operator {
      return getOperator(ctx);
    }

    public relationalOperator(ctx: any): Operator {
      return getOperator(ctx);
    }

    public shiftOperator(ctx: any): Operator {
      return getOperator(ctx);
    }

    public additiveOperator(ctx: any): Operator {
      return getOperator(ctx);
    }

    public multiplicativeOperator(ctx: any): Operator {
      return getOperator(ctx);
    }

    public prefixOperator(ctx: any): Operator {
      return getOperator(ctx);
    }

    public postfixOperator(ctx: any): Operator {
      return getOperator(ctx);
    }

    public unaryOperator(ctx: any): Operator {
      return getOperator(ctx);
    }

    public number(ctx: { [key: string]: any[] }): number {
      return this.visitChoices(ctx, [
        {
          name: "NumberBinaryLiteral",
          build: (value: any[]) => parseInt(first(value).image.substring(2), 2),
        },
        { name: "NumberOctalLiteral", build: (value: any[]) => parseInt(first(value).image, 8) },
        { name: "NumberDecimalLiteral", build: (value: any[]) => parseInt(first(value).image, 10) },
        {
          name: "NumberHexadecimalLiteral",
          build: (value: any[]) =>
            parseInt(
              first(value)
                .image.substring(2)
                .replace(/[Lu]$/, ""),
              16,
            ),
        },
        {
          name: "NumberHexadecimalLiteral2",
          build: (value: any[]) => parseInt(first(value).image.replace(/h$/, ""), 16),
        },
      ]);
    }

    public expressionOrTypeName(ctx: any) {
      return this.visitFirst(ctx, "assignmentExpression", "typeNameWithoutVoid");
    }

    public arguments(ctx: any) {
      return this.visitAll(ctx, "assignmentExpression");
    }

    public annotations(ctx: any): Annotation[] {
      return this.visitAll(ctx, "annotation");
    }

    public annotation(ctx: any): Annotation {
      return new Annotation(getIdentifier(ctx.Identifier), this.visit(ctx.simpleValue));
    }

    public arrayInitializer(ctx: any) {
      return {
        type: "arrayDeclaration",
        values: this.visitAll(ctx, "assignmentExpression"),
      };
    }

    public bitfieldRest(ctx: any) {
      return this.visit(ctx.additiveExpression);
    }

    public enumDeclaration(ctx: any) {
      return this.visitAll(ctx, "enumElementDeclaration");
    }

    public enumElementDeclaration(ctx: any) {
      const result: any = {
        name: getIdentifier(ctx.Identifier),
      };
      if (has(ctx, "assignmentExpression")) {
        result.value = this.visit(ctx.assignmentExpression);
      }
      return result;
    }

    public forInitUpdate(ctx: any) {
      return {
        type: "commaExpression",
        expressions: this.visitAll(ctx, "assignmentExpression"),
      };
    }

    public arraySelector(ctx: any) {
      return this.visit(ctx.assignmentExpression);
    }

    public anyArraySelector(ctx: any) {
      return this.visitChoices(ctx, [
        { name: "emptyArraySelector", build: () => ({ array: true }) },
        {
          name: "arraySelector",
          build: () => ({
            array: true,
            arraySelector: this.visit(ctx.arraySelector),
          }),
        },
      ]);
    }

    public variableInitializer(ctx: any) {
      return this.visitFirst(ctx, "assignmentExpression", "arrayInitializer");
    }

    public simpleValue(ctx: any): Value {
      return this.visitChoices(ctx, [
        { name: "number", build: () => new NumberValue(this.visit(ctx.number)) },
        { name: "boolean", build: () => new BooleanValue(this.visit(ctx.boolean)) },
        { name: "Identifier", build: () => new IdentifierValue(getIdentifier(ctx.Identifier)) },
        { name: "StringLiteral", build: () => new StringValue(getString(ctx.StringLiteral)) },
      ]);
    }

    public boolean(ctx: any): boolean {
      return this.visitChoices(ctx, [
        { name: "True", build: () => true },
        { name: "False", build: () => false },
      ]);
    }

    private visitIfPresent(ctx: any, propertyName: string, defaultValue?: any): any {
      return has(ctx, propertyName) ? this.visit(get(ctx, propertyName)) : defaultValue;
    }

    private visitAll(ctx: any, propertyName: string): any[] {
      return map(get(ctx, propertyName), this.visit.bind(this));
    }

    private visitFirst(ctx: any, ...propertyNames: string[]): any {
      for (let i = 0; i < propertyNames.length; ++i) {
        if (has(ctx, propertyNames[i])) {
          return this.visit(get(ctx, propertyNames[i]));
        }
      }
      throw new Error(
        `Context does not contain expected property name (expected: ${propertyNames}, was: ${keys(ctx)})`,
      );
    }

    private visitChoices(ctx: any, choices: { name: string; build: (value: any) => any }[]): any {
      for (let i = 0; i < choices.length; ++i) {
        if (has(ctx, choices[i].name)) {
          return choices[i].build(get(ctx, choices[i].name));
        }
      }
      throw new Error();
    }
  }

  return new Visitor();
}
