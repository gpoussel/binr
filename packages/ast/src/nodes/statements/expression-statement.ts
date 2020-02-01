import { EvaluationContext } from "../../evaluation";
import { AstVisitor } from "../../visitor";
import { Expression } from "../expressions";
import { Statement } from "./statement";

export class ExpressionStatement extends Statement {
  public constructor(private _expression: Expression) {
    super();
  }

  public get expression(): Expression {
    return this._expression;
  }

  public evaluate(_context: EvaluationContext): void {
    // Nothing to do
  }

  protected accept0(visitor: AstVisitor): void {
    if (visitor.visitExpressionStatement(this)) {
      this._expression.accept(visitor);
    }
    visitor.endVisitExpressionStatement(this);
  }
}
