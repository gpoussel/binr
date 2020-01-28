import { Value } from "./value";

export class NumberValue extends Value {
  private _value: number;

  public constructor(value: number) {
    super("numberValue");
    this._value = value;
  }

  public get value() {
    return this._value;
  }
}
