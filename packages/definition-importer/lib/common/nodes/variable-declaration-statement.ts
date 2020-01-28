import { Statement } from "./statement";

export class VariableDeclarationStatement extends Statement {
  private _typeName: any;
  private _modifiers: any;
  private _bitfield: any;
  private _variableDeclarators: any;
  private _annotations: any;

  public constructor(
    typeName: any,
    modifiers: any,
    bitfield: any,
    variableDeclarators: any,
    annotations: any,
  ) {
    super("variableDeclarationStatement");
    this._typeName = typeName;
    this._modifiers = modifiers;
    this._bitfield = bitfield;
    this._variableDeclarators = variableDeclarators;
    this._annotations = annotations;
  }

  public get typeName() {
    return this._typeName;
  }
  public get modifiers() {
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
