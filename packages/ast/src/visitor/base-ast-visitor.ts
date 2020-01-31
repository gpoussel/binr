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
  ForwardFunctionDeclarationStatement,
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
  preVisit(_node: Node): void {}
  postVisit(_node: Node): void {}
  visitAnnotation(_node: Annotation): boolean {
    return true;
  }
  endVisitAnnotation(_node: Annotation): void {}
  visitArrayIndexExpression(_node: ArrayIndexExpression): boolean {
    return true;
  }
  endVisitArrayIndexExpression(_node: ArrayIndexExpression): void {}
  visitArrayInitializationExpression(_node: ArrayInitializationExpression): boolean {
    return true;
  }
  endVisitArrayInitializationExpression(_node: ArrayInitializationExpression): void {}
  visitArrayValueElement(_node: ArrayValueElement): boolean {
    return true;
  }
  endVisitArrayValueElement(_node: ArrayValueElement): void {}
  visitArrayValueExpression(_node: ArrayValueExpression): boolean {
    return true;
  }
  endVisitArrayValueExpression(_node: ArrayValueExpression): void {}
  visitAssignmentExpression(_node: AssignmentExpression): boolean {
    return true;
  }
  endVisitAssignmentExpression(_node: AssignmentExpression): void {}
  visitBinaryExpression(_node: BinaryExpression): boolean {
    return true;
  }
  endVisitBinaryExpression(_node: BinaryExpression): void {}
  visitBitmaskDeclarationElement(_node: BitmaskDeclarationElement): boolean {
    return true;
  }
  endVisitBitmaskDeclarationElement(_node: BitmaskDeclarationElement): void {}
  visitBitmaskDeclarationStatement(_node: BitmaskDeclarationStatement): boolean {
    return true;
  }
  endVisitBitmaskDeclarationStatement(_node: BitmaskDeclarationStatement): void {}
  visitBlockStatement(_node: BlockStatement): boolean {
    return true;
  }
  endVisitBlockStatement(_node: BlockStatement): void {}
  visitBooleanValueExpression(_node: BooleanValueExpression): boolean {
    return true;
  }
  endVisitBooleanValueExpression(_node: BooleanValueExpression): void {}
  visitBreakStatement(_node: BreakStatement): boolean {
    return true;
  }
  endVisitBreakStatement(_node: BreakStatement): void {}
  visitCaseSwitchElement(_node: CaseSwitchElement): boolean {
    return true;
  }
  endVisitCaseSwitchElement(_node: CaseSwitchElement): void {}
  visitCastExpression(_node: CastExpression): boolean {
    return true;
  }
  endVisitCastExpression(_node: CastExpression): void {}
  visitCommaExpression(_node: CommaExpression): boolean {
    return true;
  }
  endVisitCommaExpression(_node: CommaExpression): void {}
  visitDefaultSwitchLabel(_node: DefaultSwitchLabel): boolean {
    return true;
  }
  endVisitDefaultSwitchLabel(_node: DefaultSwitchLabel): void {}
  visitDefinition(_node: Definition): boolean {
    return true;
  }
  endVisitDefinition(_node: Definition): void {}
  visitDoWhileStatement(_node: DoWhileStatement): boolean {
    return true;
  }
  endVisitDoWhileStatement(_node: DoWhileStatement): void {}
  visitEmptyArraySelector(_node: EmptyArraySelector): boolean {
    return true;
  }
  endVisitEmptyArraySelector(_node: EmptyArraySelector): void {}
  visitEmptyStatement(_node: EmptyStatement): boolean {
    return true;
  }
  endVisitEmptyStatement(_node: EmptyStatement): void {}
  visitEnumDeclarationElement(_node: EnumDeclarationElement): boolean {
    return true;
  }
  endVisitEnumDeclarationElement(_node: EnumDeclarationElement): void {}
  visitEnumDeclarationStatement(_node: EnumDeclarationStatement): boolean {
    return true;
  }
  endVisitEnumDeclarationStatement(_node: EnumDeclarationStatement): void {}
  visitEnumReferenceType(_node: EnumReferenceType): boolean {
    return true;
  }
  endVisitEnumReferenceType(_node: EnumReferenceType): void {}
  visitExpressionArraySelector(_node: ExpressionArraySelector): boolean {
    return true;
  }
  endVisitExpressionArraySelector(_node: ExpressionArraySelector): void {}
  visitExpressionArrayValueElement(_node: ExpressionArrayValueElement): boolean {
    return true;
  }
  endVisitExpressionArrayValueElement(_node: ExpressionArrayValueElement): void {}
  visitExpressionStatement(_node: ExpressionStatement): boolean {
    return true;
  }
  endVisitExpressionStatement(_node: ExpressionStatement): void {}
  visitForStatement(_node: ForStatement): boolean {
    return true;
  }
  endVisitForStatement(_node: ForStatement): void {}
  visitForwardFunctionDeclarationStatement(_node: ForwardFunctionDeclarationStatement): boolean {
    return true;
  }
  endVisitForwardFunctionDeclarationStatement(_node: ForwardFunctionDeclarationStatement): void {}
  visitForwardStructDeclarationStatement(_node: ForwardStructDeclarationStatement): boolean {
    return true;
  }
  endVisitForwardStructDeclarationStatement(_node: ForwardStructDeclarationStatement): void {}
  visitFunctionCallExpression(_node: FunctionCallExpression): boolean {
    return true;
  }
  endVisitFunctionCallExpression(_node: FunctionCallExpression): void {}
  visitFunctionDeclarationStatement(_node: FunctionDeclarationStatement): boolean {
    return true;
  }
  endVisitFunctionDeclarationStatement(_node: FunctionDeclarationStatement): void {}
  visitIdentifierValueExpression(_node: IdentifierValueExpression): boolean {
    return true;
  }
  endVisitIdentifierValueExpression(_node: IdentifierValueExpression): void {}
  visitIfElseStatement(_node: IfElseStatement): boolean {
    return true;
  }
  endVisitIfElseStatement(_node: IfElseStatement): void {}
  visitIfStatement(_node: IfStatement): boolean {
    return true;
  }
  endVisitIfStatement(_node: IfStatement): void {}
  visitInlineEnumDeclarationStatement(_node: InlineEnumDeclarationStatement): boolean {
    return true;
  }
  endVisitInlineEnumDeclarationStatement(_node: InlineEnumDeclarationStatement): void {}
  visitInlineStructDeclarationStatement(_node: InlineStructDeclarationStatement): boolean {
    return true;
  }
  endVisitInlineStructDeclarationStatement(_node: InlineStructDeclarationStatement): void {}
  visitInlineUnionDeclarationStatement(_node: InlineUnionDeclarationStatement): boolean {
    return true;
  }
  endVisitInlineUnionDeclarationStatement(_node: InlineUnionDeclarationStatement): void {}
  visitNamedType(_node: NamedType): boolean {
    return true;
  }
  endVisitNamedType(_node: NamedType): void {}
  visitNumberValueExpression(_node: NumberValueExpression): boolean {
    return true;
  }
  endVisitNumberValueExpression(_node: NumberValueExpression): void {}
  visitParameterDeclaration(_node: ParameterDeclaration): boolean {
    return true;
  }
  endVisitParameterDeclaration(_node: ParameterDeclaration): void {}
  visitPostfixExpression(_node: PostfixExpression): boolean {
    return true;
  }
  endVisitPostfixExpression(_node: PostfixExpression): void {}
  visitPrefixExpression(_node: PrefixExpression): boolean {
    return true;
  }
  endVisitPrefixExpression(_node: PrefixExpression): void {}
  visitPropertyAccessExpression(_node: PropertyAccessExpression): boolean {
    return true;
  }
  endVisitPropertyAccessExpression(_node: PropertyAccessExpression): void {}
  visitRestrictedType(_node: RestrictedType): boolean {
    return true;
  }
  endVisitRestrictedType(_node: RestrictedType): void {}
  visitReturnStatement(_node: ReturnStatement): boolean {
    return true;
  }
  endVisitReturnStatement(_node: ReturnStatement): void {}
  visitSizeofExpression(_node: SizeofExpression): boolean {
    return true;
  }
  endVisitSizeofExpression(_node: SizeofExpression): void {}
  visitStringValueExpression(_node: StringValueExpression): boolean {
    return true;
  }
  endVisitStringValueExpression(_node: StringValueExpression): void {}
  visitStructDeclarationStatement(_node: StructDeclarationStatement): boolean {
    return true;
  }
  endVisitStructDeclarationStatement(_node: StructDeclarationStatement): void {}
  visitStructReferenceType(_node: StructReferenceType): boolean {
    return true;
  }
  endVisitStructReferenceType(_node: StructReferenceType): void {}
  visitSwitchStatement(_node: SwitchStatement): boolean {
    return true;
  }
  endVisitSwitchStatement(_node: SwitchStatement): void {}
  visitTernaryExpression(_node: TernaryExpression): boolean {
    return true;
  }
  endVisitTernaryExpression(_node: TernaryExpression): void {}
  visitTypedefStatement(_node: TypedefStatement): boolean {
    return true;
  }
  endVisitTypedefStatement(_node: TypedefStatement): void {}
  visitUnaryExpression(_node: UnaryExpression): boolean {
    return true;
  }
  endVisitUnaryExpression(_node: UnaryExpression): void {}
  visitUndefinedArrayValueElement(_node: UndefinedArrayValueElement): boolean {
    return true;
  }
  endVisitUndefinedArrayValueElement(_node: UndefinedArrayValueElement): void {}
  visitUnionDeclarationStatement(_node: UnionDeclarationStatement): boolean {
    return true;
  }
  endVisitUnionDeclarationStatement(_node: UnionDeclarationStatement): void {}
  visitUntilExpressionArraySelector(_node: UntilExpressionArraySelector): boolean {
    return true;
  }
  endVisitUntilExpressionArraySelector(_node: UntilExpressionArraySelector): void {}
  visitValueSwitchLabel(_node: ValueSwitchLabel): boolean {
    return true;
  }
  endVisitValueSwitchLabel(_node: ValueSwitchLabel): void {}
  visitVariableDeclaration(_node: VariableDeclaration): boolean {
    return true;
  }
  endVisitVariableDeclaration(_node: VariableDeclaration): void {}
  visitVariableDeclarationStatement(_node: VariableDeclarationStatement): boolean {
    return true;
  }
  endVisitVariableDeclarationStatement(_node: VariableDeclarationStatement): void {}
  visitVoidType(_node: VoidType): boolean {
    return true;
  }
  endVisitVoidType(_node: VoidType): void {}
  visitWhileStatement(_node: WhileStatement): boolean {
    return true;
  }
  endVisitWhileStatement(_node: WhileStatement): void {}
}
