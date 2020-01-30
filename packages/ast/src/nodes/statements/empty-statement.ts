import { AstVisitor } from "../../visitor/ast-visitor";
import { Statement } from "./statement";

export class EmptyStatement extends Statement {
  protected accept0(visitor: AstVisitor): void {
    visitor.visitEmptyStatement(this);
    visitor.endVisitEmptyStatement(this);
  }
}
