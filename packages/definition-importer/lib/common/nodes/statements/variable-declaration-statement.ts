import { Annotation } from "../annotation";
import { Expression } from "../expressions";
import { Type } from "../type";
import { VariableDeclaration } from "../variable-declaration";
import { VariableModifier } from "../variable-modifier";
import { Statement } from "./statement";

export class VariableDeclarationStatement extends Statement {
  public constructor(
    private _variableType: Type,
    private _modifiers: VariableModifier[],
    private _bitfield: Expression,
    private _variableDeclarations: VariableDeclaration[],
    private _annotations: Annotation[],
  ) {
    super();
  }

  public get variableType(): Type {
    return this._variableType;
  }
  public get modifiers(): VariableModifier[] {
    return this._modifiers;
  }
  public get bitfield(): Expression {
    return this._bitfield;
  }
  public get variableDeclarations(): VariableDeclaration[] {
    return this._variableDeclarations;
  }
  public get annotations(): Annotation[] {
    return this._annotations;
  }
}