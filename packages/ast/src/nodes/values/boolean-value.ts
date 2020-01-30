import { Value } from "./value";

export class BooleanValue extends Value {
  public constructor(private _value: boolean) {
    super();
  }

  public get value() {
    return this._value;
  }
}
