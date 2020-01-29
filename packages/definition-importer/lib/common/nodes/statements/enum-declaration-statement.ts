import { EnumDeclarationElement } from "../enum-declaration-element";
import { Type } from "../types";
import { VariableDeclaration } from "../variable-declaration";
import { Statement } from "./statement";

export class EnumDeclarationStatement extends Statement {
  public constructor(
    private _baseType: Type,
    private _alias: string | undefined,
    private _declarations: EnumDeclarationElement[],
    private _variableDeclarations: VariableDeclaration[],
  ) {
    super();
  }

  public get baseType(): Type {
    return this._baseType;
  }

  public get alias(): string | undefined {
    return this._alias;
  }

  public get declarations(): EnumDeclarationElement[] {
    return this._declarations;
  }

  public get variableDeclarations(): VariableDeclaration[] {
    return this._variableDeclarations;
  }
}
