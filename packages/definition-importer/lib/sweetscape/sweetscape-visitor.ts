import { CstParser } from "chevrotain";
import { concat, each, first, get, has, isEmpty, isUndefined, keys, map, parseInt, size } from "lodash";

import {
  Annotation,
  ArrayIndexExpression,
  ArrayInitializationExpression,
  ArraySelector,
  BinaryExpression,
  BlockStatement,
  BooleanValue,
  BreakStatement,
  CaseSwitchElement,
  CastExpression,
  CommaExpression,
  DefaultSwitchLabel,
  Definition,
  DoWhileStatement,
  EmptyArraySelector,
  EmptyStatement,
  EnumDeclarationElement,
  EnumDeclarationStatement,
  Expression,
  ExpressionArraySelector,
  ExpressionStatement,
  ForStatement,
  ForwardStructDeclarationStatement,
  FunctionCallExpression,
  FunctionDeclarationStatement,
  IdentifierValue,
  IfStatement,
  NamedType,
  NumberValue,
  Operator,
  ParameterDeclaration,
  PostfixExpression,
  PrefixExpression,
  PropertyAccessExpression,
  ReturnStatement,
  SizeofExpression,
  Statement,
  StringValue,
  StructDeclarationStatement,
  StructReferenceType,
  SwitchLabel,
  SwitchStatement,
  TernaryExpression,
  Type,
  TypeModifier,
  TypedefStatement,
  UnaryExpression,
  UnionDeclarationStatement,
  Value,
  ValueSwitchLabel,
  VariableDeclaration,
  VariableDeclarationStatement,
  VariableModifier,
  VoidType,
  WhileStatement,
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

function getIdentifier(identifierToken: any[]): string {
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

    public functionDeclarationStatement(ctx: any): FunctionDeclarationStatement {
      const returnType = this.visit(ctx.typeName);
      const name = getIdentifier(ctx.Identifier);
      const forwardDeclaration = has(ctx, "SemiColon");
      const body = this.visitIfPresent(ctx, "block");
      const parameters = this.visit(ctx.functionParameterDeclarationList);
      return new FunctionDeclarationStatement(returnType, name, parameters, forwardDeclaration, body);
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

    public typeNameWithoutVoid(ctx: any): Type {
      const name = getIdentifier(ctx.Identifier);
      if (has(ctx, "Struct")) {
        return new StructReferenceType(name);
      }

      const modifiers: TypeModifier[] = [];
      if (has(ctx, "Signed")) {
        modifiers.push(TypeModifier.SIGNED);
      }
      if (has(ctx, "Unsigned")) {
        modifiers.push(TypeModifier.UNSIGNED);
      }
      const array: boolean = has(ctx, "emptyArraySelector");
      return new NamedType(name, modifiers, array);
    }

    public functionParameterDeclarationList(ctx: any): ParameterDeclaration[] {
      if (has(ctx, "Void")) {
        return [];
      }
      return this.visitAll(ctx, "functionParameterDeclaration");
    }

    public functionParameterDeclaration(ctx: any): ParameterDeclaration {
      const type = this.visit(ctx.typeNameWithoutVoid);
      const name = getIdentifier(ctx.Identifier);
      const arraySelector = this.visitIfPresent(ctx, "anyArraySelector");
      const byReference = has(ctx, "BinaryAnd");
      const modifiers = this.visitAll(ctx, "modifier");
      return new ParameterDeclaration(type, name, arraySelector, byReference, modifiers);
    }

    public block(ctx: any): BlockStatement {
      return new BlockStatement(this.visit(ctx.statementList));
    }

    public statement(ctx: any): Statement {
      return this.visitFirst(
        ctx,
        "block",
        "expressionStatement",
        "localVariableDeclarationStatement",
        "typedefStatement",
        "structStatement",
        "forwardStructDeclarationStatement",
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

    public returnStatement(ctx: any): ReturnStatement {
      if (!has(ctx, "assignmentExpression")) {
        return new ReturnStatement();
      }
      return new ReturnStatement(this.visit(ctx.assignmentExpression));
    }

    public breakStatement(): BreakStatement {
      return new BreakStatement();
    }

    public emptyStatement(): EmptyStatement {
      return new EmptyStatement();
    }

    public whileStatement(ctx: any): WhileStatement {
      return new WhileStatement(this.visit(ctx.parExpression), this.visit(ctx.statement));
    }

    public doWhileStatement(ctx: any): DoWhileStatement {
      return new DoWhileStatement(this.visit(ctx.parExpression), this.visit(ctx.statement));
    }

    public switchStatement(ctx: any): SwitchStatement {
      return new SwitchStatement(this.visitAll(ctx, "switchBlockStatementGroup"));
    }

    public switchBlockStatementGroup(ctx: any): CaseSwitchElement {
      return new CaseSwitchElement(this.visit(ctx.switchLabels), this.visit(ctx.statementList));
    }

    public switchLabels(ctx: any): SwitchLabel[] {
      const values: SwitchLabel[] = map(
        this.visitAll(ctx, "simpleValue"),
        (value) => new ValueSwitchLabel(value),
      );
      if (has(ctx, "Default")) {
        values.push(new DefaultSwitchLabel());
      }
      return values;
    }

    public forStatement(ctx: any): ForStatement {
      return new ForStatement(
        this.visit(ctx.forInitUpdate[0]),
        this.visit(ctx.assignmentExpression),
        this.visit(ctx.forInitUpdate[1]),
        this.visit(ctx.statement),
      );
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

    public variableDeclarators(ctx: any): VariableDeclaration[] {
      return this.visitAll(ctx, "variableDeclarator");
    }

    public variableModifier(ctx: any): VariableModifier {
      return this.visitChoices(ctx, [
        { name: "Local", build: () => VariableModifier.LOCAL },
        { name: "Const", build: () => VariableModifier.CONST },
      ]);
    }

    public typedefStatement(ctx: any): TypedefStatement {
      const type = this.visit(ctx.typeName);
      const alias = getIdentifier(ctx.Identifier);
      const arraySelector = this.visitIfPresent(ctx, "arraySelector");
      const annotations = this.visitIfPresent(ctx, "annotations", []);
      return new TypedefStatement(type, alias, arraySelector, annotations);
    }

    public statementList(ctx: any): Statement[] {
      return this.visitAll(ctx, "statement");
    }

    public ifStatement(ctx: any): IfStatement {
      const condition = this.visit(ctx.parExpression);
      const statements = this.visitAll(ctx, "statement");
      if (size(statements) === 1) {
        // No "else" statement
        return new IfStatement(condition, statements[0]);
      }
      return new IfStatement(condition, statements[0], statements[1]);
    }

    public structStatement(ctx: any): StructDeclarationStatement | UnionDeclarationStatement {
      const alias = has(ctx, "Identifier") ? getIdentifier(ctx.Identifier) : undefined;
      const variableDeclaration = this.visit(ctx.variableDeclarator);
      const declarationCtx = get(first(get(ctx, "structDeclaration")), "children");
      const parameters = this.visitIfPresent(declarationCtx, "functionParameterDeclarationList", []);
      const body = this.visitIfPresent(declarationCtx, "block");

      if (has(ctx, "Struct")) {
        return new StructDeclarationStatement(alias, variableDeclaration, parameters, body);
      }
      return new UnionDeclarationStatement(alias, variableDeclaration, parameters, body);
    }

    public forwardStructDeclarationStatement(ctx: any): ForwardStructDeclarationStatement {
      return new ForwardStructDeclarationStatement(getIdentifier(ctx.Identifier));
    }

    public enumStatement(ctx: any): EnumDeclarationStatement {
      const typeName = this.visitIfPresent(ctx, "typeName");
      const alias = has(ctx, "Identifier") ? getIdentifier(ctx.Identifier) : undefined;
      const declarations = this.visitIfPresent(ctx, "enumDeclaration", []);
      const variableDeclarations = this.visitChoices(
        ctx,
        [
          { name: "variableDeclarators", build: () => this.visitAll(ctx, "variableDeclarators") },
          { name: "variableDeclarator", build: () => [this.visit(ctx.variableDeclarator)] },
        ],
        () => [],
      );
      return new EnumDeclarationStatement(typeName, alias, declarations, variableDeclarations);
    }

    public variableDeclarator(ctx: any): VariableDeclaration {
      const name = getIdentifier(ctx.Identifier);
      const variableDeclaratorRestCtx = get(first(get(ctx, "variableDeclaratorRest")), "children");
      const annotations = concat(
        this.visitIfPresent(ctx, "annotations", []),
        this.visitIfPresent(variableDeclaratorRestCtx, "annotations", []),
      );
      const bitfield = this.visitIfPresent(ctx, "bitfieldRest");
      const arraySelector = this.visitIfPresent(variableDeclaratorRestCtx, "anyArraySelector");
      const typeArguments = this.visitIfPresent(variableDeclaratorRestCtx, "arguments", []);
      const initializationExpression = this.visitIfPresent(variableDeclaratorRestCtx, "variableInitializer");
      return new VariableDeclaration(
        name,
        bitfield,
        arraySelector,
        typeArguments,
        initializationExpression,
        annotations,
      );
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

    public callExpression(ctx: any): Expression {
      const memberResult: Expression = this.visit(ctx.memberExpression);
      let currentExpression: Expression = memberResult;
      each(ctx.callExpressionRest, (expressionRest) => {
        const { children: expressionRestChildren } = expressionRest;
        if (has(expressionRestChildren, "arguments")) {
          // That's a function call
          currentExpression = new FunctionCallExpression(
            currentExpression,
            this.visit(expressionRestChildren.arguments),
          );
        } else if (has(expressionRestChildren, "arraySelector")) {
          // That's an array index
          currentExpression = new ArrayIndexExpression(
            currentExpression,
            this.visit(expressionRestChildren.arraySelector),
          );
        } else if (has(expressionRestChildren, "propertyAccess")) {
          currentExpression = new PropertyAccessExpression(
            currentExpression,
            this.visit(expressionRestChildren.propertyAccess),
          );
        } else {
          throw new Error();
        }
      });
      return currentExpression;
    }

    public propertyAccess(ctx: any): string {
      return getIdentifier(ctx.Identifier);
    }

    public memberExpression(ctx: any): Expression {
      const primaryResult: any = this.visit(ctx.primaryExpression);
      let currentExpression = primaryResult;
      each(ctx.memberExpressionRest, (expressionRest) => {
        const { children: expressionRestChildren } = expressionRest;
        if (has(expressionRestChildren, "arraySelector")) {
          // That's an array index
          currentExpression = new ArrayIndexExpression(
            currentExpression,
            this.visit(expressionRestChildren.arraySelector),
          );
        } else if (has(expressionRestChildren, "propertyAccess")) {
          currentExpression = new PropertyAccessExpression(
            currentExpression,
            this.visit(expressionRestChildren.propertyAccess),
          );
        } else {
          throw new Error();
        }
      });
      return currentExpression;
    }

    public primaryExpression(ctx: any): Expression {
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

    public expressionOrTypeName(ctx: any): Expression | Type {
      return this.visitFirst(ctx, "assignmentExpression", "typeNameWithoutVoid");
    }

    public arguments(ctx: any): Expression[] {
      return this.visitAll(ctx, "assignmentExpression");
    }

    public annotations(ctx: any): Annotation[] {
      return this.visitAll(ctx, "annotation");
    }

    public annotation(ctx: any): Annotation {
      return new Annotation(getIdentifier(ctx.Identifier), this.visit(ctx.simpleValue));
    }

    public arrayInitializer(ctx: any): ArrayInitializationExpression {
      return new ArrayInitializationExpression(this.visitAll(ctx, "assignmentExpression"));
    }

    public bitfieldRest(ctx: any): Expression {
      return this.visit(ctx.additiveExpression);
    }

    public enumDeclaration(ctx: any): EnumDeclarationElement[] {
      return this.visitAll(ctx, "enumElementDeclaration");
    }

    public enumElementDeclaration(ctx: any): EnumDeclarationElement {
      return new EnumDeclarationElement(
        getIdentifier(ctx.Identifier),
        this.visitIfPresent(ctx, "assignmentExpression"),
      );
    }

    public forInitUpdate(ctx: any): CommaExpression {
      return new CommaExpression(this.visitAll(ctx, "assignmentExpression"));
    }

    public arraySelector(ctx: any): Expression {
      return this.visit(ctx.assignmentExpression);
    }

    public anyArraySelector(ctx: any): ArraySelector {
      return this.visitChoices(ctx, [
        { name: "emptyArraySelector", build: () => new EmptyArraySelector() },
        {
          name: "arraySelector",
          build: () => new ExpressionArraySelector(this.visit(ctx.arraySelector)),
        },
      ]);
    }

    public variableInitializer(ctx: any): Expression {
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

    private visitChoices(
      ctx: any,
      choices: { name: string; build: (value: any) => any }[],
      defaultBuilder?: () => any,
    ): any {
      for (let i = 0; i < choices.length; ++i) {
        if (has(ctx, choices[i].name)) {
          return choices[i].build(get(ctx, choices[i].name));
        }
      }
      if (!isUndefined(defaultBuilder)) {
        return defaultBuilder();
      }
      throw new Error();
    }
  }

  return new Visitor();
}
