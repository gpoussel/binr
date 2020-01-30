import { AstVisitor } from "../../../visitor/ast-visitor";
import { ValueExpression } from "./value-expression";

export class BooleanValueExpression extends ValueExpression {
  public constructor(private _value: boolean) {
    super();
  }

  public get value() {
    return this._value;
  }

  protected accept0(visitor: AstVisitor): void {
    visitor.visitBooleanValueExpression(this);
    visitor.endVisitBooleanValueExpression(this);
  }
}
