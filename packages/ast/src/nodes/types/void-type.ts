import { AstVisitor } from "../../visitor/ast-visitor";
import { Type } from "./type";

export class VoidType extends Type {
  protected accept0(visitor: AstVisitor): void {
    visitor.visitVoidType(this);
    visitor.endVisitVoidType(this);
  }
}
