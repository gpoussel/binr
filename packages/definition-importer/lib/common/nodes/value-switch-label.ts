import { SwitchLabel } from "./switch-label";
import { Value } from "./value";

export class ValueSwitchLabel extends SwitchLabel {
  public constructor(private _value: Value) {
    super();
  }

  public get value(): Value {
    return this._value;
  }
}
