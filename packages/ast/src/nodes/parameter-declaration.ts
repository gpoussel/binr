import { ArraySelector } from "./array-selector";
import { Node } from "./node";
import { NamedType } from "./types/named-type";
import { VariableModifier } from "./variable-modifier";

export class ParameterDeclaration extends Node {
  public constructor(
    private _type: NamedType,
    private _name: string,
    private _arraySelector: ArraySelector,
    private _byReference: boolean,
    private _modifiers: VariableModifier[],
  ) {
    super();
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
