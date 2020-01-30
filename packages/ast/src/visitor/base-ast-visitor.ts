import {
  Annotation,
  ArrayIndexExpression,
  ArrayInitializationExpression,
  ArrayValueElement,
  ArrayValueExpression,
  AssignmentExpression,
  BinaryExpression,
  BitmaskDeclarationElement,
  BitmaskDeclarationStatement,
  BlockStatement,
  BooleanValueExpression,
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
  EnumReferenceType,
  ExpressionArraySelector,
  ExpressionArrayValueElement,
  ExpressionStatement,
  ForStatement,
  ForwardStructDeclarationStatement,
  FunctionCallExpression,
  FunctionDeclarationStatement,
  IdentifierValueExpression,
  IfElseStatement,
  IfStatement,
  InlineEnumDeclarationStatement,
  InlineStructDeclarationStatement,
  InlineUnionDeclarationStatement,
  NamedType,
  Node,
  NumberValueExpression,
  ParameterDeclaration,
  PostfixExpression,
  PrefixExpression,
  PropertyAccessExpression,
  RestrictedType,
  ReturnStatement,
  SizeofExpression,
  StringValueExpression,
  StructDeclarationStatement,
  StructReferenceType,
  SwitchStatement,
  TernaryExpression,
  TypedefStatement,
  UnaryExpression,
  UndefinedArrayValueElement,
  UnionDeclarationStatement,
  UntilExpressionArraySelector,
  ValueSwitchLabel,
  VariableDeclaration,
  VariableDeclarationStatement,
  VoidType,
  WhileStatement,
} from "../nodes";
import { AstVisitor } from "./ast-visitor";

export class BaseAstVisitor extends AstVisitor {
  preVisit(_node: Node): void {
    console.log("preVisit", _node);
  }
  postVisit(_node: Node): void {
    console.log("postVisit", _node);
  }
  visitAnnotation(_node: Annotation): boolean {
    console.log("visitAnnotation");
    return true;
  }
  endVisitAnnotation(_node: Annotation): void {}
  visitArrayIndexExpression(_node: ArrayIndexExpression): boolean {
    console.log("visitArrayIndexExpression");
    return true;
  }
  endVisitArrayIndexExpression(_node: ArrayIndexExpression): void {}
  visitArrayInitializationExpression(_node: ArrayInitializationExpression): boolean {
    console.log("visitArrayInitializationExpression");
    return true;
  }
  endVisitArrayInitializationExpression(_node: ArrayInitializationExpression): void {}
  visitArrayValueElement(_node: ArrayValueElement): boolean {
    console.log("visitArrayValueElement");
    return true;
  }
  endVisitArrayValueElement(_node: ArrayValueElement): void {}
  visitArrayValueExpression(_node: ArrayValueExpression): boolean {
    console.log("visitArrayValueExpression");
    return true;
  }
  endVisitArrayValueExpression(_node: ArrayValueExpression): void {}
  visitAssignmentExpression(_node: AssignmentExpression): boolean {
    console.log("visitAssignmentExpression");
    return true;
  }
  endVisitAssignmentExpression(_node: AssignmentExpression): void {}
  visitBinaryExpression(_node: BinaryExpression): boolean {
    console.log("visitBinaryExpression");
    return true;
  }
  endVisitBinaryExpression(_node: BinaryExpression): void {}
  visitBitmaskDeclarationElement(_node: BitmaskDeclarationElement): boolean {
    console.log("visitBitmaskDeclarationElement");
    return true;
  }
  endVisitBitmaskDeclarationElement(_node: BitmaskDeclarationElement): void {}
  visitBitmaskDeclarationStatement(_node: BitmaskDeclarationStatement): boolean {
    console.log("visitBitmaskDeclarationStatement");
    return true;
  }
  endVisitBitmaskDeclarationStatement(_node: BitmaskDeclarationStatement): void {}
  visitBlockStatement(_node: BlockStatement): boolean {
    console.log("visitBlockStatement");
    return true;
  }
  endVisitBlockStatement(_node: BlockStatement): void {}
  visitBooleanValueExpression(_node: BooleanValueExpression): boolean {
    console.log("visitBooleanValueExpression");
    return true;
  }
  endVisitBooleanValueExpression(_node: BooleanValueExpression): void {}
  visitBreakStatement(_node: BreakStatement): boolean {
    console.log("visitBreakStatement");
    return true;
  }
  endVisitBreakStatement(_node: BreakStatement): void {}
  visitCaseSwitchElement(_node: CaseSwitchElement): boolean {
    console.log("visitCaseSwitchElement");
    return true;
  }
  endVisitCaseSwitchElement(_node: CaseSwitchElement): void {}
  visitCastExpression(_node: CastExpression): boolean {
    console.log("visitCastExpression");
    return true;
  }
  endVisitCastExpression(_node: CastExpression): void {}
  visitCommaExpression(_node: CommaExpression): boolean {
    console.log("visitCommaExpression");
    return true;
  }
  endVisitCommaExpression(_node: CommaExpression): void {}
  visitDefaultSwitchLabel(_node: DefaultSwitchLabel): boolean {
    console.log("visitDefaultSwitchLabel");
    return true;
  }
  endVisitDefaultSwitchLabel(_node: DefaultSwitchLabel): void {}
  visitDefinition(_node: Definition): boolean {
    console.log("visitDefinition");
    return true;
  }
  endVisitDefinition(_node: Definition): void {}
  visitDoWhileStatement(_node: DoWhileStatement): boolean {
    console.log("visitDoWhileStatement");
    return true;
  }
  endVisitDoWhileStatement(_node: DoWhileStatement): void {}
  visitEmptyArraySelector(_node: EmptyArraySelector): boolean {
    console.log("visitEmptyArraySelector");
    return true;
  }
  endVisitEmptyArraySelector(_node: EmptyArraySelector): void {}
  visitEmptyStatement(_node: EmptyStatement): boolean {
    console.log("visitEmptyStatement");
    return true;
  }
  endVisitEmptyStatement(_node: EmptyStatement): void {}
  visitEnumDeclarationElement(_node: EnumDeclarationElement): boolean {
    console.log("visitEnumDeclarationElement");
    return true;
  }
  endVisitEnumDeclarationElement(_node: EnumDeclarationElement): void {}
  visitEnumDeclarationStatement(_node: EnumDeclarationStatement): boolean {
    console.log("visitEnumDeclarationStatement");
    return true;
  }
  endVisitEnumDeclarationStatement(_node: EnumDeclarationStatement): void {}
  visitEnumReferenceType(_node: EnumReferenceType): boolean {
    console.log("visitEnumReferenceType");
    return true;
  }
  endVisitEnumReferenceType(_node: EnumReferenceType): void {}
  visitExpressionArraySelector(_node: ExpressionArraySelector): boolean {
    console.log("visitExpressionArraySelector");
    return true;
  }
  endVisitExpressionArraySelector(_node: ExpressionArraySelector): void {}
  visitExpressionArrayValueElement(_node: ExpressionArrayValueElement): boolean {
    console.log("visitExpressionArrayValueElement");
    return true;
  }
  endVisitExpressionArrayValueElement(_node: ExpressionArrayValueElement): void {}
  visitExpressionStatement(_node: ExpressionStatement): boolean {
    console.log("visitExpressionStatement");
    return true;
  }
  endVisitExpressionStatement(_node: ExpressionStatement): void {}
  visitForStatement(_node: ForStatement): boolean {
    console.log("visitForStatement");
    return true;
  }
  endVisitForStatement(_node: ForStatement): void {}
  visitForwardStructDeclarationStatement(_node: ForwardStructDeclarationStatement): boolean {
    console.log("visitForwardStructDeclarationStatement");
    return true;
  }
  endVisitForwardStructDeclarationStatement(_node: ForwardStructDeclarationStatement): void {}
  visitFunctionCallExpression(_node: FunctionCallExpression): boolean {
    console.log("visitFunctionCallExpression");
    return true;
  }
  endVisitFunctionCallExpression(_node: FunctionCallExpression): void {}
  visitFunctionDeclarationStatement(_node: FunctionDeclarationStatement): boolean {
    console.log("visitFunctionDeclarationStatement");
    return true;
  }
  endVisitFunctionDeclarationStatement(_node: FunctionDeclarationStatement): void {}
  visitIdentifierValueExpression(_node: IdentifierValueExpression): boolean {
    console.log("visitIdentifierValueExpression");
    return true;
  }
  endVisitIdentifierValueExpression(_node: IdentifierValueExpression): void {}
  visitIfElseStatement(_node: IfElseStatement): boolean {
    console.log("visitIfElseStatement");
    return true;
  }
  endVisitIfElseStatement(_node: IfElseStatement): void {}
  visitIfStatement(_node: IfStatement): boolean {
    console.log("visitIfStatement");
    return true;
  }
  endVisitIfStatement(_node: IfStatement): void {}
  visitInlineEnumDeclarationStatement(_node: InlineEnumDeclarationStatement): boolean {
    console.log("visitInlineEnumDeclarationStatement");
    return true;
  }
  endVisitInlineEnumDeclarationStatement(_node: InlineEnumDeclarationStatement): void {}
  visitInlineStructDeclarationStatement(_node: InlineStructDeclarationStatement): boolean {
    console.log("visitInlineStructDeclarationStatement");
    return true;
  }
  endVisitInlineStructDeclarationStatement(_node: InlineStructDeclarationStatement): void {}
  visitInlineUnionDeclarationStatement(_node: InlineUnionDeclarationStatement): boolean {
    console.log("visitInlineUnionDeclarationStatement");
    return true;
  }
  endVisitInlineUnionDeclarationStatement(_node: InlineUnionDeclarationStatement): void {}
  visitNamedType(_node: NamedType): boolean {
    console.log("visitNamedType");
    return true;
  }
  endVisitNamedType(_node: NamedType): void {}
  visitNumberValueExpression(_node: NumberValueExpression): boolean {
    console.log("visitNumberValueExpression");
    return true;
  }
  endVisitNumberValueExpression(_node: NumberValueExpression): void {}
  visitParameterDeclaration(_node: ParameterDeclaration): boolean {
    console.log("visitParameterDeclaration");
    return true;
  }
  endVisitParameterDeclaration(_node: ParameterDeclaration): void {}
  visitPostfixExpression(_node: PostfixExpression): boolean {
    console.log("visitPostfixExpression");
    return true;
  }
  endVisitPostfixExpression(_node: PostfixExpression): void {}
  visitPrefixExpression(_node: PrefixExpression): boolean {
    console.log("visitPrefixExpression");
    return true;
  }
  endVisitPrefixExpression(_node: PrefixExpression): void {}
  visitPropertyAccessExpression(_node: PropertyAccessExpression): boolean {
    console.log("visitPropertyAccessExpression");
    return true;
  }
  endVisitPropertyAccessExpression(_node: PropertyAccessExpression): void {}
  visitRestrictedType(_node: RestrictedType): boolean {
    console.log("visitRestrictedType");
    return true;
  }
  endVisitRestrictedType(_node: RestrictedType): void {}
  visitReturnStatement(_node: ReturnStatement): boolean {
    console.log("visitReturnStatement");
    return true;
  }
  endVisitReturnStatement(_node: ReturnStatement): void {}
  visitSizeofExpression(_node: SizeofExpression): boolean {
    console.log("visitSizeofExpression");
    return true;
  }
  endVisitSizeofExpression(_node: SizeofExpression): void {}
  visitStringValueExpression(_node: StringValueExpression): boolean {
    console.log("visitStringValueExpression");
    return true;
  }
  endVisitStringValueExpression(_node: StringValueExpression): void {}
  visitStructDeclarationStatement(_node: StructDeclarationStatement): boolean {
    console.log("visitStructDeclarationStatement");
    return true;
  }
  endVisitStructDeclarationStatement(_node: StructDeclarationStatement): void {}
  visitStructReferenceType(_node: StructReferenceType): boolean {
    console.log("visitStructReferenceType");
    return true;
  }
  endVisitStructReferenceType(_node: StructReferenceType): void {}
  visitSwitchStatement(_node: SwitchStatement): boolean {
    console.log("visitSwitchStatement");
    return true;
  }
  endVisitSwitchStatement(_node: SwitchStatement): void {}
  visitTernaryExpression(_node: TernaryExpression): boolean {
    console.log("visitTernaryExpression");
    return true;
  }
  endVisitTernaryExpression(_node: TernaryExpression): void {}
  visitTypedefStatement(_node: TypedefStatement): boolean {
    console.log("visitTypedefStatement");
    return true;
  }
  endVisitTypedefStatement(_node: TypedefStatement): void {}
  visitUnaryExpression(_node: UnaryExpression): boolean {
    console.log("visitUnaryExpression");
    return true;
  }
  endVisitUnaryExpression(_node: UnaryExpression): void {}
  visitUndefinedArrayValueElement(_node: UndefinedArrayValueElement): boolean {
    console.log("visitUndefinedArrayValueElement");
    return true;
  }
  endVisitUndefinedArrayValueElement(_node: UndefinedArrayValueElement): void {}
  visitUnionDeclarationStatement(_node: UnionDeclarationStatement): boolean {
    console.log("visitUnionDeclarationStatement");
    return true;
  }
  endVisitUnionDeclarationStatement(_node: UnionDeclarationStatement): void {}
  visitUntilExpressionArraySelector(_node: UntilExpressionArraySelector): boolean {
    console.log("visitUntilExpressionArraySelector");
    return true;
  }
  endVisitUntilExpressionArraySelector(_node: UntilExpressionArraySelector): void {}
  visitValueSwitchLabel(_node: ValueSwitchLabel): boolean {
    console.log("visitValueSwitchLabel");
    return true;
  }
  endVisitValueSwitchLabel(_node: ValueSwitchLabel): void {}
  visitVariableDeclaration(_node: VariableDeclaration): boolean {
    console.log("visitVariableDeclaration");
    return true;
  }
  endVisitVariableDeclaration(_node: VariableDeclaration): void {}
  visitVariableDeclarationStatement(_node: VariableDeclarationStatement): boolean {
    console.log("visitVariableDeclarationStatement");
    return true;
  }
  endVisitVariableDeclarationStatement(_node: VariableDeclarationStatement): void {}
  visitVoidType(_node: VoidType): boolean {
    console.log("visitVoidType");
    return true;
  }
  endVisitVoidType(_node: VoidType): void {}
  visitWhileStatement(_node: WhileStatement): boolean {
    console.log("visitWhileStatement");
    return true;
  }
  endVisitWhileStatement(_node: WhileStatement): void {}
}
