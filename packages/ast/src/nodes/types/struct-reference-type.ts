import { AstVisitor } from "../../visitor/ast-visitor";
import { Type } from "./type";

export class StructReferenceType extends Type {
  public constructor(private _name: string) {
    super();
  }

  public get name(): string {
    return this._name;
  }

  protected accept0(visitor: AstVisitor): void {
    visitor.visitStructReferenceType(this);
    visitor.endVisitStructReferenceType(this);
  }
}
