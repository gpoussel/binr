import { Value } from "./value";

export class NumberValue extends Value {
  public constructor(private _value: number) {
    super();
  }

  public get value() {
    return this._value;
  }
}
