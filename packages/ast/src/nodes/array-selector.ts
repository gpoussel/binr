import { AstVisitor } from "../visitor/ast-visitor";
import { Expression } from "./expressions";
import { Node } from "./node";

export abstract class ArraySelector extends Node {}

export class EmptyArraySelector extends ArraySelector {
  protected accept0(visitor: AstVisitor): void {
    visitor.visitEmptyArraySelector(this);
    visitor.endVisitEmptyArraySelector(this);
  }
}

export class ExpressionArraySelector extends ArraySelector {
  public constructor(private _innerExpression: Expression) {
    super();
  }

  public get innerExpression(): Expression {
    return this._innerExpression;
  }

  protected accept0(visitor: AstVisitor): void {
    if (visitor.visitExpressionArraySelector(this)) {
      this._innerExpression.accept(visitor);
    }
    visitor.endVisitExpressionArraySelector(this);
  }
}

export class UntilExpressionArraySelector extends ArraySelector {
  public constructor(private _innerExpression: Expression) {
    super();
  }

  public get innerExpression(): Expression {
    return this._innerExpression;
  }

  protected accept0(visitor: AstVisitor): void {
    if (visitor.visitUntilExpressionArraySelector(this)) {
      this._innerExpression.accept(visitor);
    }
    visitor.endVisitUntilExpressionArraySelector(this);
  }
}
