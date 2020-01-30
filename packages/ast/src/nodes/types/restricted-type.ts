import { AstVisitor } from "../../visitor/ast-visitor";
import { Type } from "./type";

export class RestrictedType extends Type {
  public constructor(private _baseType: Type, private _size: number) {
    super();
  }

  public get baseType(): Type {
    return this._baseType;
  }

  public get size(): number {
    return this._size;
  }

  protected accept0(visitor: AstVisitor): void {
    visitor.visitRestrictedType(this);
    visitor.endVisitRestrictedType(this);
  }
}
