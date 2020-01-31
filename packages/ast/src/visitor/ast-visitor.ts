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
  ExistenceCheckExpression,
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

export abstract class AstVisitor {
  public abstract preVisit(node: Node): void;
  public abstract postVisit(node: Node): void;
  public abstract visitAnnotation(node: Annotation): boolean;
  public abstract endVisitAnnotation(node: Annotation): void;
  public abstract visitArrayIndexExpression(node: ArrayIndexExpression): boolean;
  public abstract endVisitArrayIndexExpression(node: ArrayIndexExpression): void;
  public abstract visitArrayInitializationExpression(node: ArrayInitializationExpression): boolean;
  public abstract endVisitArrayInitializationExpression(node: ArrayInitializationExpression): void;
  public abstract visitArrayValueElement(node: ArrayValueElement): boolean;
  public abstract endVisitArrayValueElement(node: ArrayValueElement): void;
  public abstract visitArrayValueExpression(node: ArrayValueExpression): boolean;
  public abstract endVisitArrayValueExpression(node: ArrayValueExpression): void;
  public abstract visitAssignmentExpression(node: AssignmentExpression): boolean;
  public abstract endVisitAssignmentExpression(node: AssignmentExpression): void;
  public abstract visitBinaryExpression(node: BinaryExpression): boolean;
  public abstract endVisitBinaryExpression(node: BinaryExpression): void;
  public abstract visitBitmaskDeclarationElement(node: BitmaskDeclarationElement): boolean;
  public abstract endVisitBitmaskDeclarationElement(node: BitmaskDeclarationElement): void;
  public abstract visitBitmaskDeclarationStatement(node: BitmaskDeclarationStatement): boolean;
  public abstract endVisitBitmaskDeclarationStatement(node: BitmaskDeclarationStatement): void;
  public abstract visitBlockStatement(node: BlockStatement): boolean;
  public abstract endVisitBlockStatement(node: BlockStatement): void;
  public abstract visitBooleanValueExpression(node: BooleanValueExpression): boolean;
  public abstract endVisitBooleanValueExpression(node: BooleanValueExpression): void;
  public abstract visitBreakStatement(node: BreakStatement): boolean;
  public abstract endVisitBreakStatement(node: BreakStatement): void;
  public abstract visitCaseSwitchElement(node: CaseSwitchElement): boolean;
  public abstract endVisitCaseSwitchElement(node: CaseSwitchElement): void;
  public abstract visitCastExpression(node: CastExpression): boolean;
  public abstract endVisitCastExpression(node: CastExpression): void;
  public abstract visitCommaExpression(node: CommaExpression): boolean;
  public abstract endVisitCommaExpression(node: CommaExpression): void;
  public abstract visitDefaultSwitchLabel(node: DefaultSwitchLabel): boolean;
  public abstract endVisitDefaultSwitchLabel(node: DefaultSwitchLabel): void;
  public abstract visitDefinition(node: Definition): boolean;
  public abstract endVisitDefinition(node: Definition): void;
  public abstract visitDoWhileStatement(node: DoWhileStatement): boolean;
  public abstract endVisitDoWhileStatement(node: DoWhileStatement): void;
  public abstract visitEmptyArraySelector(node: EmptyArraySelector): boolean;
  public abstract endVisitEmptyArraySelector(node: EmptyArraySelector): void;
  public abstract visitEmptyStatement(node: EmptyStatement): boolean;
  public abstract endVisitEmptyStatement(node: EmptyStatement): void;
  public abstract visitEnumDeclarationElement(node: EnumDeclarationElement): boolean;
  public abstract endVisitEnumDeclarationElement(node: EnumDeclarationElement): void;
  public abstract visitEnumDeclarationStatement(node: EnumDeclarationStatement): boolean;
  public abstract endVisitEnumDeclarationStatement(node: EnumDeclarationStatement): void;
  public abstract visitEnumReferenceType(node: EnumReferenceType): boolean;
  public abstract endVisitEnumReferenceType(node: EnumReferenceType): void;
  public abstract visitExistenceCheckExpression(node: ExistenceCheckExpression): boolean;
  public abstract endVisitExistenceCheckExpression(node: ExistenceCheckExpression): void;
  public abstract visitExpressionArraySelector(node: ExpressionArraySelector): boolean;
  public abstract endVisitExpressionArraySelector(node: ExpressionArraySelector): void;
  public abstract visitExpressionArrayValueElement(node: ExpressionArrayValueElement): boolean;
  public abstract endVisitExpressionArrayValueElement(node: ExpressionArrayValueElement): void;
  public abstract visitExpressionStatement(node: ExpressionStatement): boolean;
  public abstract endVisitExpressionStatement(node: ExpressionStatement): void;
  public abstract visitForStatement(node: ForStatement): boolean;
  public abstract endVisitForStatement(node: ForStatement): void;
  public abstract visitForwardFunctionDeclarationStatement(
    node: ForwardFunctionDeclarationStatement,
  ): boolean;
  public abstract endVisitForwardFunctionDeclarationStatement(
    node: ForwardFunctionDeclarationStatement,
  ): void;
  public abstract visitForwardStructDeclarationStatement(node: ForwardStructDeclarationStatement): boolean;
  public abstract endVisitForwardStructDeclarationStatement(node: ForwardStructDeclarationStatement): void;
  public abstract visitFunctionCallExpression(node: FunctionCallExpression): boolean;
  public abstract endVisitFunctionCallExpression(node: FunctionCallExpression): void;
  public abstract visitFunctionDeclarationStatement(node: FunctionDeclarationStatement): boolean;
  public abstract endVisitFunctionDeclarationStatement(node: FunctionDeclarationStatement): void;
  public abstract visitIdentifierValueExpression(node: IdentifierValueExpression): boolean;
  public abstract endVisitIdentifierValueExpression(node: IdentifierValueExpression): void;
  public abstract visitIfElseStatement(node: IfElseStatement): boolean;
  public abstract endVisitIfElseStatement(node: IfElseStatement): void;
  public abstract visitIfStatement(node: IfStatement): boolean;
  public abstract endVisitIfStatement(node: IfStatement): void;
  public abstract visitInlineEnumDeclarationStatement(node: InlineEnumDeclarationStatement): boolean;
  public abstract endVisitInlineEnumDeclarationStatement(node: InlineEnumDeclarationStatement): void;
  public abstract visitInlineStructDeclarationStatement(node: InlineStructDeclarationStatement): boolean;
  public abstract endVisitInlineStructDeclarationStatement(node: InlineStructDeclarationStatement): void;
  public abstract visitInlineUnionDeclarationStatement(node: InlineUnionDeclarationStatement): boolean;
  public abstract endVisitInlineUnionDeclarationStatement(node: InlineUnionDeclarationStatement): void;
  public abstract visitNamedType(node: NamedType): boolean;
  public abstract endVisitNamedType(node: NamedType): void;
  public abstract visitNumberValueExpression(node: NumberValueExpression): boolean;
  public abstract endVisitNumberValueExpression(node: NumberValueExpression): void;
  public abstract visitParameterDeclaration(node: ParameterDeclaration): boolean;
  public abstract endVisitParameterDeclaration(node: ParameterDeclaration): void;
  public abstract visitPostfixExpression(node: PostfixExpression): boolean;
  public abstract endVisitPostfixExpression(node: PostfixExpression): void;
  public abstract visitPrefixExpression(node: PrefixExpression): boolean;
  public abstract endVisitPrefixExpression(node: PrefixExpression): void;
  public abstract visitPropertyAccessExpression(node: PropertyAccessExpression): boolean;
  public abstract endVisitPropertyAccessExpression(node: PropertyAccessExpression): void;
  public abstract visitRestrictedType(node: RestrictedType): boolean;
  public abstract endVisitRestrictedType(node: RestrictedType): void;
  public abstract visitReturnStatement(node: ReturnStatement): boolean;
  public abstract endVisitReturnStatement(node: ReturnStatement): void;
  public abstract visitSizeofExpression(node: SizeofExpression): boolean;
  public abstract endVisitSizeofExpression(node: SizeofExpression): void;
  public abstract visitStringValueExpression(node: StringValueExpression): boolean;
  public abstract endVisitStringValueExpression(node: StringValueExpression): void;
  public abstract visitStructDeclarationStatement(node: StructDeclarationStatement): boolean;
  public abstract endVisitStructDeclarationStatement(node: StructDeclarationStatement): void;
  public abstract visitStructReferenceType(node: StructReferenceType): boolean;
  public abstract endVisitStructReferenceType(node: StructReferenceType): void;
  public abstract visitSwitchStatement(node: SwitchStatement): boolean;
  public abstract endVisitSwitchStatement(node: SwitchStatement): void;
  public abstract visitTernaryExpression(node: TernaryExpression): boolean;
  public abstract endVisitTernaryExpression(node: TernaryExpression): void;
  public abstract visitTypedefStatement(node: TypedefStatement): boolean;
  public abstract endVisitTypedefStatement(node: TypedefStatement): void;
  public abstract visitUnaryExpression(node: UnaryExpression): boolean;
  public abstract endVisitUnaryExpression(node: UnaryExpression): void;
  public abstract visitUndefinedArrayValueElement(node: UndefinedArrayValueElement): boolean;
  public abstract endVisitUndefinedArrayValueElement(node: UndefinedArrayValueElement): void;
  public abstract visitUnionDeclarationStatement(node: UnionDeclarationStatement): boolean;
  public abstract endVisitUnionDeclarationStatement(node: UnionDeclarationStatement): void;
  public abstract visitUntilExpressionArraySelector(node: UntilExpressionArraySelector): boolean;
  public abstract endVisitUntilExpressionArraySelector(node: UntilExpressionArraySelector): void;
  public abstract visitValueSwitchLabel(node: ValueSwitchLabel): boolean;
  public abstract endVisitValueSwitchLabel(node: ValueSwitchLabel): void;
  public abstract visitVariableDeclaration(node: VariableDeclaration): boolean;
  public abstract endVisitVariableDeclaration(node: VariableDeclaration): void;
  public abstract visitVariableDeclarationStatement(node: VariableDeclarationStatement): boolean;
  public abstract endVisitVariableDeclarationStatement(node: VariableDeclarationStatement): void;
  public abstract visitVoidType(node: VoidType): boolean;
  public abstract endVisitVoidType(node: VoidType): void;
  public abstract visitWhileStatement(node: WhileStatement): boolean;
  public abstract endVisitWhileStatement(node: WhileStatement): void;
}
