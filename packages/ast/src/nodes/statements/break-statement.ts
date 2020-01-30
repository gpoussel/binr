import { AstVisitor } from "../../visitor/ast-visitor";
import { Statement } from "./statement";

export class BreakStatement extends Statement {
  protected accept0(visitor: AstVisitor): void {
    visitor.visitBreakStatement(this);
    visitor.endVisitBreakStatement(this);
  }
}
