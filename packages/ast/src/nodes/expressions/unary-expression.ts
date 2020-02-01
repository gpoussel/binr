import { EvaluationContext, EvaluationInput } from "../../evaluation";
import { AstVisitor } from "../../visitor";
import { Operator } from "../operator";
import { Expression } from "./expression";

export class UnaryExpression extends Expression {
  public constructor(private _innerExpression: Expression, private _operator: Operator) {
    super();
  }

  public get innerExpression() {
    return this._innerExpression;
  }

  public get operator() {
    return this._operator;
  }

  public evaluate(_context: EvaluationContext, _input: EvaluationInput): void {
    // Nothing to do
  }

  protected accept0(visitor: AstVisitor): void {
    if (visitor.visitUnaryExpression(this)) {
      this._innerExpression.accept(visitor);
    }
    visitor.endVisitUnaryExpression(this);
  }
}
