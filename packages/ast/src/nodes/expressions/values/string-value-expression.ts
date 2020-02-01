import { EvaluationContext } from "../../../evaluation";
import { AstVisitor } from "../../../visitor";
import { ValueExpression } from "./value-expression";

export class StringValueExpression extends ValueExpression {
  public constructor(private _value: string) {
    super();
  }

  public get value() {
    return this._value;
  }

  public evaluate(_context: EvaluationContext): void {
    // Nothing to do
  }

  protected accept0(visitor: AstVisitor): void {
    visitor.visitStringValueExpression(this);
    visitor.endVisitStringValueExpression(this);
  }
}
