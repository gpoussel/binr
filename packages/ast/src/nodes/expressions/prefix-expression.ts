import { EvaluationContext } from "../../evaluation";
import { AstVisitor } from "../../visitor";
import { Operator } from "../operator";
import { Expression } from "./expression";

export class PrefixExpression extends Expression {
  public constructor(private _innerExpression: Expression, private _operator: Operator) {
    super();
  }

  public get innerExpression() {
    return this._innerExpression;
  }

  public get operator() {
    return this._operator;
  }

  public evaluate(_context: EvaluationContext): void {
    // Nothing to do
  }

  protected accept0(visitor: AstVisitor): void {
    if (visitor.visitPrefixExpression(this)) {
      this._innerExpression.accept(visitor);
    }
    visitor.endVisitPrefixExpression(this);
  }
}
