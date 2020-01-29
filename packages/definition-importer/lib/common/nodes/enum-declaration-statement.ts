import { Statement } from "./statement";
import { Type } from "./type";

export class EnumDeclarationStatement extends Statement {
  private _baseType: Type;
  private _alias: string;

  public constructor(baseType: Type, alias: string) {
    super();
    this._baseType = baseType;
    this._alias = alias;
  }

  public get baseType(): Type {
    return this._baseType;
  }

  public get alias(): string {
    return this._alias;
  }
}
