import { EvaluationContext, EvaluationInput } from "../../evaluation";
import { AstVisitor } from "../../visitor";
import { Expression } from "./expression";

export class CastExpression extends Expression {
  public constructor(private _castExpression: Expression, private _innerExpression: Expression) {
    super();
  }

  public get castExpression(): Expression {
    return this._castExpression;
  }

  public get innerExpression() {
    return this._innerExpression;
  }

  public evaluate(_context: EvaluationContext, _input: EvaluationInput): void {
    // Nothing to do
  }

  protected accept0(visitor: AstVisitor): void {
    if (visitor.visitCastExpression(this)) {
      this._castExpression.accept(visitor);
      this._innerExpression.accept(visitor);
    }
    visitor.endVisitCastExpression(this);
  }
}
