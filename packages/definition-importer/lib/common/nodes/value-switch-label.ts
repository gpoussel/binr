import { SwitchLabel } from "./switch-label";
import { Value } from "./values";

export class ValueSwitchLabel extends SwitchLabel {
  public constructor(private _value: Value) {
    super();
  }

  public get value(): Value {
    return this._value;
  }
}
