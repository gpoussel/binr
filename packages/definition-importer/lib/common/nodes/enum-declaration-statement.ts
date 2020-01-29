import { EnumDeclarationElement } from "./enum-declaration-element";
import { Statement } from "./statement";
import { Type } from "./type";
import { VariableDeclaration } from "./variable-declaration";

export class EnumDeclarationStatement extends Statement {
  private _baseType: Type;
  private _alias: string | undefined;
  private _declarations: EnumDeclarationElement[];
  private _variableDeclarations: VariableDeclaration[];

  public constructor(
    baseType: Type,
    alias: string | undefined,
    declarations: EnumDeclarationElement[],
    variableDeclarations: VariableDeclaration[],
  ) {
    super();
    this._baseType = baseType;
    this._alias = alias;
    this._declarations = declarations;
    this._variableDeclarations = variableDeclarations;
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
