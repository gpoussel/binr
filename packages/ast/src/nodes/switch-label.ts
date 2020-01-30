import { ValueExpression } from "./expressions";
import { Node } from "./node";

export abstract class SwitchLabel extends Node {}

export class DefaultSwitchLabel extends SwitchLabel {}

export class ValueSwitchLabel extends SwitchLabel {
  public constructor(private _value: ValueExpression) {
    super();
  }

  public get value(): ValueExpression {
    return this._value;
  }
}
