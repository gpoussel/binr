import { Value } from "./value";

export class StringValue extends Value {
  private _value: string;

  public constructor(value: string) {
    super();
    this._value = value;
  }

  public get value() {
    return this._value;
  }
}
