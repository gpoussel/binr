import { EvaluationContext, EvaluationInput } from "../../evaluation";
import { AstVisitor } from "../../visitor";
import { Expression } from "./expression";

export class TernaryExpression extends Expression {
  public constructor(
    private _condition: Expression,
    private _trueExpression: Expression,
    private _falseExpression: Expression,
  ) {
    super();
  }

  public get condition(): Expression {
    return this._condition;
  }

  public get trueExpression(): Expression {
    return this._trueExpression;
  }

  public get falseExpression(): Expression {
    return this._falseExpression;
  }

  public evaluate(_context: EvaluationContext, _input: EvaluationInput): void {
    // Nothing to do
  }

  protected accept0(visitor: AstVisitor): void {
    if (visitor.visitTernaryExpression(this)) {
      this._condition.accept(visitor);
      this._trueExpression.accept(visitor);
      this._falseExpression.accept(visitor);
    }
    visitor.endVisitTernaryExpression(this);
  }
}
