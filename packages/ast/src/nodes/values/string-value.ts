import { Value } from "./value";

export class StringValue extends Value {
  public constructor(private _value: string) {
    super();
  }

  public get value() {
    return this._value;
  }
}
