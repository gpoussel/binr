import { ValueExpression } from "./value-expression";

export class NumberValueExpression extends ValueExpression {
  public constructor(private _value: number) {
    super();
  }

  public get value() {
    return this._value;
  }
}
