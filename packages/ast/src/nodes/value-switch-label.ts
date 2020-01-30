import { ValueExpression } from "./expressions/values";
import { SwitchLabel } from "./switch-label";

export class ValueSwitchLabel extends SwitchLabel {
  public constructor(private _value: ValueExpression) {
    super();
  }

  public get value(): ValueExpression {
    return this._value;
  }
}
