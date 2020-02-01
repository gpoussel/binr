import { EvaluationContext } from "../evaluation";
import { AstVisitor } from "../visitor";
import { Expression } from "./expressions";
import { Node } from "./node";

export abstract class ArraySelector extends Node {}

export class EmptyArraySelector extends ArraySelector {
  public evaluate(_context: EvaluationContext): void {
    // Nothing to do
  }

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

  public evaluate(_context: EvaluationContext): void {
    // Nothing to do
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

  public evaluate(_context: EvaluationContext): void {
    // Nothing to do
  }

  protected accept0(visitor: AstVisitor): void {
    if (visitor.visitUntilExpressionArraySelector(this)) {
      this._innerExpression.accept(visitor);
    }
    visitor.endVisitUntilExpressionArraySelector(this);
  }
}
