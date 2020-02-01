import { EvaluationContext, EvaluationInput } from "../../evaluation";
import { AstVisitor } from "../../visitor";
import { Type } from "../types";
import { Expression } from "./expression";

export class PositionReferenceExpression extends Expression {
  public constructor(private _innerExpression: Expression | Type) {
    super();
  }

  public get innerExpression(): Expression | Type {
    return this._innerExpression;
  }

  public evaluate(_context: EvaluationContext, _input: EvaluationInput): void {
    // Nothing to do
  }

  protected accept0(visitor: AstVisitor): void {
    if (visitor.visitPositionReferenceExpression(this)) {
      this._innerExpression.accept(visitor);
    }
    visitor.endVisitPositionReferenceExpression(this);
  }
}
