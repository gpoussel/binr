import { Annotation } from "../annotation";
import { EnumDeclarationElement } from "../enum-declaration-element";
import { Type } from "../types";
import { Statement } from "./statement";

export class EnumDeclarationStatement extends Statement {
  public constructor(
    private _baseType: Type,
    private _name: string,
    private _declarations: EnumDeclarationElement[],
    private _annotations: Annotation[],
  ) {
    super();
  }

  public get baseType(): Type {
    return this._baseType;
  }

  public get name(): string {
    return this._name;
  }

  public get declarations(): EnumDeclarationElement[] {
    return this._declarations;
  }

  public get annotations(): Annotation[] {
    return this._annotations;
  }
}
