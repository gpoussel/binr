import { Statement } from "./statement";
import { VariableModifier } from "./variable-modifier";
import { Type } from "./type";

export class VariableDeclarationStatement extends Statement {
  private _variableType: Type;
  private _modifiers: VariableModifier[];
  private _bitfield: any;
  private _variableDeclarators: any;
  private _annotations: any;

  public constructor(
    variableType: any,
    modifiers: VariableModifier[],
    bitfield: any,
    variableDeclarators: any,
    annotations: any,
  ) {
    super();
    this._variableType = variableType;
    this._modifiers = modifiers;
    this._bitfield = bitfield;
    this._variableDeclarators = variableDeclarators;
    this._annotations = annotations;
  }

  public get variableType(): Type {
    return this._variableType;
  }
  public get modifiers(): VariableModifier[] {
    return this._modifiers;
  }
  public get bitfield() {
    return this._bitfield;
  }
  public get variableDeclarators() {
    return this._variableDeclarators;
  }
  public get annotations() {
    return this._annotations;
  }
}
