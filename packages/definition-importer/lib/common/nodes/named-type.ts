import { Type } from "./type";
import { TypeModifier } from "./type-modifier";

export class NamedType extends Type {
  private _name: string;
  private _modifiers: TypeModifier[];
  private _array: boolean;

  public constructor(name: string, modifiers: TypeModifier[], array: boolean) {
    super();
    this._name = name;
    this._modifiers = modifiers;
    this._array = array;
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
