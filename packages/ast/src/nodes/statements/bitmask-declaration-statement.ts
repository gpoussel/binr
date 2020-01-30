import { AstVisitor } from "../../visitor/ast-visitor";
import { Annotation } from "../annotation";
import { BitmaskDeclarationElement } from "../bitmask-declaration-element";
import { Type } from "../types";
import { Statement } from "./statement";

export class BitmaskDeclarationStatement extends Statement {
  public constructor(
    private _baseType: Type,
    private _name: string,
    private _declarations: BitmaskDeclarationElement[],
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

  public get declarations(): BitmaskDeclarationElement[] {
    return this._declarations;
  }

  public get annotations(): Annotation[] {
    return this._annotations;
  }

  protected accept0(visitor: AstVisitor): void {
    if (visitor.visitBitmaskDeclarationStatement(this)) {
      this._baseType.accept(visitor);
      this._declarations.map((s) => s.accept(visitor));
      this._annotations.map((s) => s.accept(visitor));
    }
    visitor.endVisitBitmaskDeclarationStatement(this);
  }
}
