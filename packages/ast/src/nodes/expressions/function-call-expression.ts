import { EvaluationContext, EvaluationInput } from "../../evaluation";
import { AstVisitor } from "../../visitor";
import { Expression } from "./expression";

export class FunctionCallExpression extends Expression {
  public constructor(private _callable: Expression, private _functionArguments: Expression[]) {
    super();
  }

  public get callable(): Expression {
    return this._callable;
  }

  public get functionArguments(): Expression[] {
    return this._functionArguments;
  }

  public evaluate(_context: EvaluationContext, _input: EvaluationInput): void {
    // Nothing to do
  }

  protected accept0(visitor: AstVisitor): void {
    if (visitor.visitFunctionCallExpression(this)) {
      this._callable.accept(visitor);
      this._functionArguments.map((s) => s.accept(visitor));
    }
    visitor.endVisitFunctionCallExpression(this);
  }
}
