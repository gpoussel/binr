import { EvaluationContext, EvaluationInput, EvaluationResult } from "../../../evaluation";
import { AstVisitor } from "../../../visitor";
import { ValueExpression } from "./value-expression";

export class IdentifierValueExpression extends ValueExpression {
  public constructor(private _name: string) {
    super();
  }

  public get name() {
    return this._name;
  }

  public evaluate(_context: EvaluationContext, _input: EvaluationInput): EvaluationResult {
    // Nothing to do
    return {};
  }

  protected accept0(visitor: AstVisitor): void {
    visitor.visitIdentifierValueExpression(this);
    visitor.endVisitIdentifierValueExpression(this);
  }
}
