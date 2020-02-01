import { EvaluationContext, EvaluationInput } from "../../evaluation";
import { AstVisitor } from "../../visitor";
import { Statement } from "./statement";

export class BreakStatement extends Statement {
  public evaluate(_context: EvaluationContext, _input: EvaluationInput): void {
    // Nothing to do
  }

  protected accept0(visitor: AstVisitor): void {
    visitor.visitBreakStatement(this);
    visitor.endVisitBreakStatement(this);
  }
}
