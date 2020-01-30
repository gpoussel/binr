import {
  BlockStatement,
  BooleanValue,
  CaseSwitchElement,
  Definition,
  EnumDeclarationElement,
  EnumDeclarationStatement,
  Expression,
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
  Value,
  ValueSwitchLabel,
} from "@binr/ast";
import { CstParser } from "chevrotain";
import { get, has, keys, map, size, times } from "lodash";

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
      // TODO annotationClause (array)
      // TODO structureClause
      // TODO bitmaskClause
      return this.visitFirst(ctx, "structureClause", "enumClause", "bitmaskClause");
    }

    public structureClause(ctx: any): StructDeclarationStatement {
      // TODO "exported" flag (ExportToken)
      const name = this.getIdentifierName(ctx.IdentifierToken[0]);
      const statements: Statement[] = this.visitAll(ctx, "statementClause");
      return new StructDeclarationStatement(name, [], new BlockStatement(statements), []);
    }

    public enumClause(ctx: any): EnumDeclarationStatement {
      const name = this.getIdentifierName(ctx.IdentifierToken[0]);
      const entries = times(ctx.IdentifierToken.length - 1, (i) => {
        const key = this.getIdentifierName(ctx.IdentifierToken[i + 1]);
        const value = this.visit(ctx.numberClause[i]);
        return new EnumDeclarationElement(key, value);
      });
      const parentType = this.visit(ctx.typeReferenceClause);
      // TODO annotations
      return new EnumDeclarationStatement(parentType, name, entries, []);
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
    // TODO fieldClause

    public BlockStatement(ctx: any): BlockStatement {
      return new BlockStatement(this.visitAll(ctx, "statementClause"));
    }

    public SwitchStatement(ctx: any): SwitchStatement {
      // TODO const testExpression = this.visit(ctx.Expression[0]);
      const switchElements = this.visitAll(ctx, "switchInnerClause");
      return new SwitchStatement(switchElements);
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
      const result = this.visit(ctx.UnaryExpression[0]);
      // TODO iteration
      /*each(ctx.ExpressionToken, (token, i) => {
        const tokenName = keys(token.children)[0];
        const tokenSymbol = token.children[tokenName][0].image;
        const childExpression = this.visit(ctx.UnaryExpression[i + 1]);
        result.push(get([], tokenSymbol, tokenSymbol));
        result.push(childExpression);
      });*/
      return result;
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

    public PrimaryExpression(ctx: any): Expression {
      if (has(ctx, "numberClause")) {
        return this.visit(ctx.numberClause[0]);
      }
      if (has(ctx, "IdentifierToken")) {
        return new IdentifierValue(this.getIdentifierName(ctx.IdentifierToken[0]));
      }
      if (has(ctx, "ParenthesisExpression")) {
        // TODO ??
        return this.visit(ctx.ParenthesisExpression);
      }
      if (has(ctx, "ArrayLiteral")) {
        // TODO ??
        return this.visit(ctx.ArrayLiteral);
      }
      if (has(ctx, "StringLiteralToken")) {
        return new StringValue(ctx.StringLiteralToken[0].image);
      }
      throw new Error();
    }

    // TODO ExpressionToken

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

    public annotationClause(ctx: any) {
      const name = this.getIdentifierName(ctx.IdentifierToken[0]);
      const value = this.visit(ctx.valueClause[0]);
      return {
        name,
        value,
      };
    }

    

    public bitmaskClause(ctx: any) {
      const name = this.getIdentifierName(ctx.IdentifierToken[0]);
      const entries = times(ctx.IdentifierToken.length - 1, (i) => ({
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
    
    

    public fieldClause(ctx: any) {
      const type = this.visit(ctx.typeReferenceClause);
      const name = this.getIdentifierName(get(ctx.IdentifierToken, 0));
      const annotations = map(ctx.annotationClause, this.visit.bind(this));
      const fieldResult = new FieldNode(type, name, annotations);
      if (has(ctx, "BoxMemberExpression")) {
        const boxMemberDefinition = this.visit(ctx.BoxMemberExpression[0]);
        fieldResult.setArrayDefinition(boxMemberDefinition.substr(1, boxMemberDefinition.length - 2));
      }
      if (has(ctx, "BoxMemberUntilExpression")) {
        fieldResult.setArrayUntilDefinition(this.visit(ctx.BoxMemberUntilExpression[0]));
      }
      return fieldResult;
    }

    public BoxMemberExpression(ctx: any) {
      return `[${this.visit(ctx.Expression)}]`;
    }

    public BoxMemberUntilExpression(ctx: any) {
      return this.visit(ctx.Expression);
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

    public ArrayLiteral(ctx: any) {
      return `[${join(map(ctx.ArrayLiteralContent, this.visit.bind(this)), "")}]`;
    }

    public ArrayLiteralContent(ctx: any) {
      if (has(ctx, "ElementList")) {
        return this.visit(ctx.ElementList);
      }
      if (has(ctx, "Elision")) {
        return this.visit(ctx.Elision);
      }
    }

    public ElementList(ctx: any) {
      const firstElement = this.visit(ctx.AssignmentExpression);
      const otherElements = join(map(ctx.ElementListEntry, this.visit.bind(this)), "");
      return firstElement + otherElements;
    }

    public ElementListEntry(ctx: any) {
      const elision = this.visit(ctx.Elision);
      const entry = this.visit(ctx.AssignmentExpression);
      return elision + entry;
    }

    public Elision(ctx: any) {
      return repeat(",", size(ctx.CommaToken));
    }

    public ParenthesisExpression(ctx: any) {
      return `(${this.visit(ctx.Expression)})`;
    }
    */
  }
  return new Visitor();
}
