import { EvaluationContext, EvaluationInput } from "../../evaluation";
import { CommaExpression } from "../../nodes";
import { AstVisitor } from "../../visitor";
import { Expression } from "../expressions";
import { Statement } from "./statement";

export class ForStatement extends Statement {
  public constructor(
    private _initialization: CommaExpression,
    private _condition: Expression,
    private _increment: CommaExpression,
    private _body: Statement,
  ) {
    super();
  }

  public get initialization(): CommaExpression {
    return this._initialization;
  }

  public get condition(): Expression {
    return this._condition;
  }

  public get increment(): CommaExpression {
    return this._increment;
  }

  public get body(): Statement {
    return this._body;
  }

  public evaluate(_context: EvaluationContext, _input: EvaluationInput): void {
    // Nothing to do
  }

  protected accept0(visitor: AstVisitor): void {
    if (visitor.visitForStatement(this)) {
      this._initialization.accept(visitor);
      this._condition.accept(visitor);
      this._increment.accept(visitor);
      this._body.accept(visitor);
    }
    visitor.endVisitForStatement(this);
  }
}
