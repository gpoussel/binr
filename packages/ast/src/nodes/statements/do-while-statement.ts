import { EvaluationContext } from "../../evaluation";
import { AstVisitor } from "../../visitor";
import { Expression } from "../expressions";
import { Statement } from "./statement";

export class DoWhileStatement extends Statement {
  public constructor(private _condition: Expression, private _body: Statement) {
    super();
  }

  public get condition(): Expression {
    return this._condition;
  }

  public get body(): Statement {
    return this._body;
  }

  public evaluate(_context: EvaluationContext): void {
    // Nothing to do
  }

  protected accept0(visitor: AstVisitor): void {
    if (visitor.visitDoWhileStatement(this)) {
      this._condition.accept(visitor);
      this._body.accept(visitor);
    }
    visitor.endVisitDoWhileStatement(this);
  }
}
