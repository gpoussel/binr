import { AstVisitor } from "../../../visitor/ast-visitor";
import { ValueExpression } from "./value-expression";

export class StringValueExpression extends ValueExpression {
  public constructor(private _value: string) {
    super();
  }

  public get value() {
    return this._value;
  }

  protected accept0(visitor: AstVisitor): void {
    visitor.visitStringValueExpression(this);
    visitor.endVisitStringValueExpression(this);
  }
}
