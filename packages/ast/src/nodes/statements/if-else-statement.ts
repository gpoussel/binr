import { EvaluationContext, EvaluationInput } from "../../evaluation";
import { AstVisitor } from "../../visitor";
import { Expression } from "../expressions";
import { Statement } from "./statement";

export class IfElseStatement extends Statement {
  public constructor(
    private _condition: Expression,
    private _trueStatement: Statement,
    private _falseStatement: Statement,
  ) {
    super();
  }

  public get condition(): Expression {
    return this._condition;
  }

  public get trueStatement(): Statement {
    return this._trueStatement;
  }

  public get falseStatement(): Statement {
    return this._falseStatement;
  }

  public evaluate(_context: EvaluationContext, _input: EvaluationInput): void {
    // Nothing to do
  }

  protected accept0(visitor: AstVisitor): void {
    if (visitor.visitIfElseStatement(this)) {
      this._condition.accept(visitor);
      this._trueStatement.accept(visitor);
      this._falseStatement.accept(visitor);
    }
    visitor.endVisitIfElseStatement(this);
  }
}
