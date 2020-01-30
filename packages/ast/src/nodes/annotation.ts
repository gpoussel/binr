import { ValueExpression } from "./expressions/values";
import { Node } from "./node";

export class Annotation extends Node {
  public constructor(private _key: string, private _value: ValueExpression) {
    super();
  }

  public get key() {
    return this._key;
  }

  public get value() {
    return this._value;
  }
}
