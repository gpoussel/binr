import { EvaluationContext, EvaluationInput, EvaluationResult } from "../../evaluation";
import { AstVisitor } from "../../visitor";
import { Expression } from "./expression";

export class CommaExpression extends Expression {
  public constructor(private _expressions: Expression[]) {
    super();
  }

  public get expressions(): Expression[] {
    return this._expressions;
  }

  public evaluate(_context: EvaluationContext, _input: EvaluationInput): EvaluationResult {
    // Nothing to do
    return {};
  }

  protected accept0(visitor: AstVisitor): void {
    if (visitor.visitCommaExpression(this)) {
      this._expressions.map((s) => s.accept(visitor));
    }
    visitor.endVisitCommaExpression(this);
  }
}
