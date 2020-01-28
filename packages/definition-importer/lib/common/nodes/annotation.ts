import { Node } from "./node";
import { Value } from "./value";

export class Annotation extends Node {
  private _key: string;
  private _value: Value;

  public constructor(key: string, value: Value) {
    super("annotation");
    this._key = key;
    this._value = value;
  }

  public get key() {
    return this._key;
  }

  public get value() {
    return this._value;
  }
}
