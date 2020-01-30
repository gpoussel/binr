import {
  Annotation,
  ArraySelector,
  ArrayValue,
  ArrayValueElement,
  BinaryExpression,
  BitmaskDeclarationElement,
  BitmaskDeclarationStatement,
  BlockStatement,
  BooleanValue,
  CaseSwitchElement,
  Definition,
  EnumDeclarationElement,
  EnumDeclarationStatement,
  Expression,
  ExpressionArraySelector,
  ExpressionArrayValueElement,
  IdentifierValue,
  IfElseStatement,
  IfStatement,
  NamedType,
  NumberValue,
  Operator,
  PostfixExpression,
  PrefixExpression,
  RestrictedType,
  Statement,
  StringValue,
  StructDeclarationStatement,
  SwitchStatement,
  TernaryExpression,
  Type,
  UndefinedArrayValueElement,
  UntilExpressionArraySelector,
  Value,
  ValueSwitchLabel,
  VariableDeclaration,
  VariableDeclarationStatement,
} from "@binr/ast";
import { CstParser } from "chevrotain";
import { concat, each, flatMap, get, has, keys, map, size, times } from "lodash";

const OPERATOR_MAPPING: { [key: string]: Operator } = {
  BooleanOrToken: Operator.BOOLEAN_OR,
  BooleanAndToken: Operator.BOOLEAN_AND,
  BinaryOrToken: Operator.BINARY_OR,
  BinaryXorToken: Operator.BINARY_XOR,
  BinaryAndToken: Operator.BINARY_AND,
  DoubleEqualsToken: Operator.DOUBLE_EQUALS,
  DifferentToken: Operator.DIFFERENT,
  ShiftRightToken: Operator.SHIFT_RIGHT,
  ShiftLeftToken: Operator.SHIFT_LEFT,
  UnsignedShiftRightToken: Operator.UNSIGNED_SHIFT_RIGHT,
  GreaterToken: Operator.GREATER,
  LessToken: Operator.LESS,
  MultiplicationToken: Operator.MULTIPLICATION,
  DivisionToken: Operator.DIVISION,
  PlusToken: Operator.PLUS,
  MinusToken: Operator.MINUS,
  ModuloToken: Operator.MODULO,
};

export function getVisitor(parser: CstParser) {
  class Visitor extends parser.getBaseCstVisitorConstructorWithDefaults() {
    constructor() {
      super();
      this.validateVisitor();
    }

    public definition(ctx: any): Definition {
      const statements = this.visitAll(ctx, "topLevelClause");
      return new Definition(statements);
    }

    public topLevelClause(ctx: any): Statement {
      const annotations = this.visitAll(ctx, "annotationClause");
      if (has(ctx, "structureClause")) {
        const structureCtx = ctx.structureClause[0].children;
        // TODO "exported" flag (ExportToken)
        const name = this.getIdentifierName(structureCtx.IdentifierToken[0]);
        const statements: Statement[] = this.visitAll(structureCtx, "statementClause");
        return new StructDeclarationStatement(name, [], new BlockStatement(statements), annotations);
      }
      if (has(ctx, "enumClause")) {
        const enumCtx = ctx.enumClause[0].children;
        const name = this.getIdentifierName(enumCtx.IdentifierToken[0]);
        const entries = times(enumCtx.IdentifierToken.length - 1, (i) => {
          const key = this.getIdentifierName(enumCtx.IdentifierToken[i + 1]);
          const value = this.visit(enumCtx.numberClause[i]);
          return new EnumDeclarationElement(key, value);
        });
        const parentType = this.visit(enumCtx.typeReferenceClause);
        return new EnumDeclarationStatement(parentType, name, entries, annotations);
      }
      if (has(ctx, "bitmaskClause")) {
        const bitmaskCtx = ctx.bitmaskClause[0].children;
        const name = this.getIdentifierName(bitmaskCtx.IdentifierToken[0]);
        const entries = times(bitmaskCtx.IdentifierToken.length - 1, (i) => {
          const key = this.getIdentifierName(bitmaskCtx.IdentifierToken[i + 1]);
          const value = this.visit(bitmaskCtx.numberClause[i]);
          return new BitmaskDeclarationElement(key, value);
        });
        const parentType = this.visit(bitmaskCtx.typeReferenceClause);
        return new BitmaskDeclarationStatement(parentType, name, entries, annotations);
      }
      throw new Error();
    }

    public statementClause(ctx: any): Statement {
      return this.visitFirst(ctx, "fieldClause", "IfStatement", "BlockStatement", "SwitchStatement");
    }

    public IfStatement(ctx: any): IfElseStatement | IfStatement {
      const condition = this.visit(ctx.Expression[0]);
      const trueStatement = this.visit(ctx.statementClause[0]);
      if (size(ctx.statementClause) > 1) {
        const falseStatement = this.visit(get(ctx.statementClause, 1));
        return new IfElseStatement(condition, trueStatement, falseStatement);
      }
      return new IfStatement(condition, trueStatement);
    }

    public fieldClause(ctx: any): VariableDeclarationStatement {
      const type = this.visit(ctx.typeReferenceClause);
      const name = this.getIdentifierName(get(ctx.IdentifierToken, 0));
      const annotations: Annotation[] = this.visitAll(ctx, "annotationClause");
      let arraySelector: ArraySelector | undefined = undefined;
      if (has(ctx, "BoxMemberUntilExpression")) {
        arraySelector = this.visit(ctx.BoxMemberUntilExpression[0]);
      } else if (has(ctx, "BoxMemberExpression")) {
        arraySelector = this.visit(ctx.BoxMemberExpression[0]);
      }
      const declaration: VariableDeclaration = new VariableDeclaration(
        name,
        undefined,
        arraySelector,
        [],
        undefined,
        [],
      );
      return new VariableDeclarationStatement(type, [], undefined, [declaration], annotations);
    }

    public BlockStatement(ctx: any): BlockStatement {
      return new BlockStatement(this.visitAll(ctx, "statementClause"));
    }

    public SwitchStatement(ctx: any): SwitchStatement {
      const testExpression = this.visit(ctx.Expression[0]);
      const switchElements = this.visitAll(ctx, "switchInnerClause");
      return new SwitchStatement(testExpression, switchElements);
    }

    public switchInnerClause(ctx: any): CaseSwitchElement {
      const value = this.visit(ctx.valueClause[0]);
      const statement = this.visit(ctx.BlockStatement[0]);
      return new CaseSwitchElement([new ValueSwitchLabel(value)], [statement]);
    }

    public Expression(ctx: any): Expression {
      return this.visit(ctx.AssignmentExpression);
    }

    public AssignmentExpression(ctx: any): Expression {
      if (has(ctx, "QuestionToken")) {
        const condition = this.visit(ctx.BinaryExpression);
        const trueExpression = this.visit(ctx.AssignmentExpression[0]);
        const falseExpression = this.visit(ctx.AssignmentExpression[1]);
        return new TernaryExpression(condition, trueExpression, falseExpression);
      }
      return this.visit(ctx.BinaryExpression);
    }

    public BinaryExpression(ctx: any): Expression {
      let currentExpression = this.visit(ctx.UnaryExpression[0]);
      each(ctx.ExpressionToken, (token, i) => {
        const operator = this.visit(token);
        const childExpression = this.visit(ctx.UnaryExpression[i + 1]);
        currentExpression = new BinaryExpression(currentExpression, childExpression, operator);
      });
      return currentExpression;
    }

    public UnaryExpression(ctx: any): Expression {
      if (has(ctx, "DoublePlusToken")) {
        return new PrefixExpression(this.visit(ctx.UnaryExpression), Operator.DOUBLE_PLUS);
      }
      if (has(ctx, "DoubleMinusToken")) {
        return new PrefixExpression(this.visit(ctx.UnaryExpression), Operator.DOUBLE_MINUS);
      }
      if (has(ctx, "PlusToken")) {
        return new PrefixExpression(this.visit(ctx.UnaryExpression), Operator.PLUS);
      }
      if (has(ctx, "MinusToken")) {
        return new PrefixExpression(this.visit(ctx.UnaryExpression), Operator.MINUS);
      }
      if (has(ctx, "TildaToken")) {
        return new PrefixExpression(this.visit(ctx.UnaryExpression), Operator.TILDA);
      }
      if (has(ctx, "ExclamationToken")) {
        return new PrefixExpression(this.visit(ctx.UnaryExpression), Operator.EXCLAMATION);
      }
      return this.visit(ctx.PostfixExpression);
    }

    public PostfixExpression(ctx: any): Expression {
      const innerExpression = this.visit(ctx.MemberCallNewExpression);
      if (has(ctx, "DoublePlusToken")) {
        return new PostfixExpression(innerExpression, Operator.DOUBLE_PLUS);
      }
      if (has(ctx, "DoubleMinusToken")) {
        return new PostfixExpression(innerExpression, Operator.DOUBLE_MINUS);
      }
      return innerExpression;
    }

    public MemberCallNewExpression(ctx: any): Expression {
      const innerExpression = this.visit(ctx.PrimaryExpression);
      // TODO MemberCallNewExpressionExtension
      return innerExpression;
    }

    public BoxMemberExpression(ctx: any): ExpressionArraySelector {
      return new ExpressionArraySelector(this.visit(ctx.Expression));
    }
    public BoxMemberUntilExpression(ctx: any): UntilExpressionArraySelector {
      return new UntilExpressionArraySelector(this.visit(ctx.Expression));
    }

    public PrimaryExpression(ctx: any): Expression {
      if (has(ctx, "numberClause")) {
        return this.visit(ctx.numberClause[0]);
      }
      if (has(ctx, "IdentifierToken")) {
        return new IdentifierValue(this.getIdentifierName(ctx.IdentifierToken[0]));
      }
      if (has(ctx, "ParenthesisExpression")) {
        return this.visit(ctx.ParenthesisExpression);
      }
      if (has(ctx, "ArrayLiteral")) {
        return this.visit(ctx.ArrayLiteral);
      }
      if (has(ctx, "StringLiteralToken")) {
        return new StringValue(ctx.StringLiteralToken[0].image);
      }
      throw new Error();
    }

    public ParenthesisExpression(ctx: any): Expression {
      return this.visit(ctx.Expression);
    }

    public ArrayLiteral(ctx: any): ArrayValue {
      return new ArrayValue(flatMap(ctx.ArrayLiteralContent, this.visit.bind(this)));
    }

    public ArrayLiteralContent(ctx: any): ArrayValueElement[] {
      if (has(ctx, "ElementList")) {
        return this.visit(ctx.ElementList);
      }
      if (has(ctx, "Elision")) {
        return this.visit(ctx.Elision);
      }
      throw new Error();
    }

    public ElementList(ctx: any): ExpressionArrayValueElement[] {
      return concat(
        [new ExpressionArrayValueElement(this.visit(ctx.AssignmentExpression))],
        map(ctx.ElementListEntry, this.visit.bind(this)),
      );
    }

    public ElementListEntry(ctx: any): ExpressionArrayValueElement {
      return new ExpressionArrayValueElement(this.visit(ctx.AssignmentExpression));
    }

    public Elision(ctx: any): UndefinedArrayValueElement[] {
      return times(size(ctx.CommaToken), () => new UndefinedArrayValueElement());
    }

    public ExpressionToken(ctx: any): Operator {
      const tokenName = keys(ctx)[0];
      return OPERATOR_MAPPING[tokenName];
    }

    public valueClause(ctx: any): Value {
      if (has(ctx, "StringLiteralToken")) {
        return new StringValue(JSON.parse(ctx.StringLiteralToken[0].image));
      }
      if (has(ctx, "TrueToken")) {
        return new BooleanValue(true);
      }
      if (has(ctx, "FalseToken")) {
        return new BooleanValue(false);
      }
      // That's a number
      return new NumberValue(this.visit(ctx.numberClause[0]));
    }

    public numberClause(ctx: any): number {
      if (has(ctx, "NumberDecimalLiteralToken")) {
        return parseInt(ctx.NumberDecimalLiteralToken[0].image, 10);
      }
      if (has(ctx, "NumberHexadecimalLiteralToken")) {
        return parseInt(ctx.NumberHexadecimalLiteralToken[0].image.substring(2), 16);
      }
      if (has(ctx, "NumberBinaryLiteralToken")) {
        return parseInt(ctx.NumberBinaryLiteralToken[0].image.substring(2), 2);
      }
      throw new Error();
    }

    public typeReferenceClause(ctx: any): Type {
      const type = this.getIdentifierName(get(ctx.IdentifierToken, 0));
      const baseType = new NamedType(type, [], false);
      if (has(ctx, "ColonToken")) {
        const typeRestriction = this.visit(ctx.numberClause[0]);
        return new RestrictedType(baseType, typeRestriction);
      }
      return baseType;
    }

    public annotationClause(ctx: any): Annotation {
      const name = this.getIdentifierName(ctx.IdentifierToken[0]);
      const value = this.visit(ctx.valueClause[0]);
      return new Annotation(name, value);
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

    private getIdentifierName(identifier: any) {
      return identifier.image;
    }

    /*

    public headerClause(ctx: any) {
      const name = this.getIdentifierName(ctx.IdentifierToken[0]);
      const value = this.visit(ctx.valueClause[0]);
      return {
        name,
        value,
      };
    }

    public MemberCallNewExpressionExtension(ctx: any) {
      if (has(ctx, "BoxMemberExpression")) {
        return this.visit(ctx.BoxMemberExpression);
      }
      if (has(ctx, "DotMemberExpression")) {
        return this.visit(ctx.DotMemberExpression);
      }
      if (has(ctx, "Arguments")) {
        return this.visit(ctx.Arguments);
      }
    }

    public Arguments(ctx: any) {
      return `(${join(map(ctx.AssignmentExpression, this.visit.bind(this)))})`;
    }

    public DotMemberExpression(ctx: any) {
      if (has(ctx, "IdentifierToken")) {
        return `.${this.getIdentifierName(ctx.IdentifierToken[0])}`;
      }
    }

    */
  }
  return new Visitor();
}
