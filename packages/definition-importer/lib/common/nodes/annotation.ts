import { Node } from "./node";
import { Value } from "./value";

export class Annotation extends Node {
  public constructor(private _key: string, private _value: Value) {
    super();
  }

  public get key() {
    return this._key;
  }

  public get value() {
    return this._value;
  }
}
