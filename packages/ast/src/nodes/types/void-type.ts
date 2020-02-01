import { EvaluationContext } from "../../evaluation";
import { AstVisitor } from "../../visitor";
import { Type } from "./type";

export class VoidType extends Type {
  public evaluate(_context: EvaluationContext): void {
    // Nothing to do
  }

  protected accept0(visitor: AstVisitor): void {
    visitor.visitVoidType(this);
    visitor.endVisitVoidType(this);
  }
}
