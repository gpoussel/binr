import { EvaluationContext, EvaluationInput } from "../../../evaluation";
import { AstVisitor } from "../../../visitor";
import { ValueExpression } from "./value-expression";

export class ThisValueExpression extends ValueExpression {
  public constructor() {
    super();
  }

  public evaluate(_context: EvaluationContext, _input: EvaluationInput): void {
    // Nothing to do
  }

  protected accept0(visitor: AstVisitor): void {
    visitor.visitThisValueExpression(this);
    visitor.endVisitThisValueExpression(this);
  }
}
