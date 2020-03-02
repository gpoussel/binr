import { EvaluationContext, EvaluationInput, EvaluationResult } from "../../evaluation";
import { AstVisitor } from "../../visitor";
import { Expression } from "../expressions";
import { Statement } from "./statement";

export class ReturnStatement extends Statement {
  public constructor(private _expression?: Expression) {
    super();
  }

  public get expression(): Expression | undefined {
    return this._expression;
  }

  public evaluate(_context: EvaluationContext, _input: EvaluationInput): EvaluationResult {
    // Nothing to do
    return {};
  }

  protected accept0(visitor: AstVisitor): void {
    if (visitor.visitReturnStatement(this)) {
      this._expression?.accept(visitor);
    }
    visitor.endVisitReturnStatement(this);
  }
}
