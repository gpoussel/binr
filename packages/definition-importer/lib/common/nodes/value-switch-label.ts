import { Value } from "./value";
import { SwitchLabel } from "./switch-label";

export class ValueSwitchLabel extends SwitchLabel {
  private _value: Value;

  public constructor(value: Value) {
    super();
    this._value = value;
  }

  public get value(): Value {
    return this._value;
  }
}
