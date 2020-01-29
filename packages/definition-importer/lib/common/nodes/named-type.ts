import { Type } from "./type";
import { TypeModifier } from "./type-modifier";

export class NamedType extends Type {
  public constructor(private _name: string, private _modifiers: TypeModifier[], private _array: boolean) {
    super();
  }

  public get name() {
    return this._name;
  }

  public get modifiers() {
    return this._modifiers;
  }

  public get array() {
    return this._array;
  }
}
