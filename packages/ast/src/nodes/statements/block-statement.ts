import { EvaluationContext, EvaluationInput, EvaluationResult } from "../../evaluation";
import { AstVisitor } from "../../visitor";
import { Statement } from "./statement";

export class BlockStatement extends Statement {
  public constructor(private _content: Statement[]) {
    super();
  }

  public get content(): Statement[] {
    return this._content;
  }

  public evaluate(_context: EvaluationContext, _input: EvaluationInput): EvaluationResult {
    // Nothing to do
    return {};
  }

  protected accept0(visitor: AstVisitor): void {
    if (visitor.visitBlockStatement(this)) {
      this._content.map((s) => s.accept(visitor));
    }
    visitor.endVisitBlockStatement(this);
  }
}
