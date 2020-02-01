import { EvaluationContext } from "../../evaluation";
import { AstVisitor } from "../../visitor";
import { Statement } from "./statement";

export class BreakStatement extends Statement {
  public evaluate(_context: EvaluationContext): void {
    // Nothing to do
  }

  protected accept0(visitor: AstVisitor): void {
    visitor.visitBreakStatement(this);
    visitor.endVisitBreakStatement(this);
  }
}
