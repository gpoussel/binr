import { Value } from "./value";

export class BooleanValue extends Value {
  private _value: boolean;

  public constructor(value: boolean) {
    super();
    this._value = value;
  }

  public get value() {
    return this._value;
  }
}
