import { Node } from "./node";
import { ArraySelector } from "./array-selector";
import { NamedType } from "./named-type";
import { VariableModifier } from "./variable-modifier";

export class ParameterDeclaration extends Node {
  private _type: NamedType;
  private _name: string;
  private _arraySelector: ArraySelector;
  private _byReference: boolean;
  private _modifiers: VariableModifier[];

  public constructor(
    type: NamedType,
    name: string,
    arraySelector: ArraySelector,
    byReference: boolean,
    modifiers: VariableModifier[],
  ) {
    super();
    this._type = type;
    this._name = name;
    this._arraySelector = arraySelector;
    this._byReference = byReference;
    this._modifiers = modifiers;
  }

  public get type(): NamedType {
    return this._type;
  }

  public get name(): string {
    return this._name;
  }

  public get arraySelector(): ArraySelector {
    return this._arraySelector;
  }

  public get byReference(): boolean {
    return this._byReference;
  }

  public get modifiers(): VariableModifier[] {
    return this._modifiers;
  }
}
