import { Statement } from "./statement";
import { VariableModifier } from "./variable-modifier";
import { Type } from "./type";
import { Annotation } from "./annotation";
import { Expression } from "./expression";
import { VariableDeclaration } from "./variable-declaration";

export class VariableDeclarationStatement extends Statement {
  private _variableType: Type;
  private _modifiers: VariableModifier[];
  private _bitfield: Expression;
  private _variableDeclarations: VariableDeclaration[];
  private _annotations: Annotation[];

  public constructor(
    variableType: Type,
    modifiers: VariableModifier[],
    bitfield: Expression,
    variableDeclarations: VariableDeclaration[],
    annotations: Annotation[],
  ) {
    super();
    this._variableType = variableType;
    this._modifiers = modifiers;
    this._bitfield = bitfield;
    this._variableDeclarations = variableDeclarations;
    this._annotations = annotations;
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
