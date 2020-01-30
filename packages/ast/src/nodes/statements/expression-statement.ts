import { AstVisitor } from "../../visitor/ast-visitor";
import { Expression } from "../expressions";
import { Statement } from "./statement";

export class ExpressionStatement extends Statement {
  public constructor(private _expression: Expression) {
    super();
  }

  public get expression(): Expression {
    return this._expression;
  }

  protected accept0(visitor: AstVisitor): void {
    if (visitor.visitExpressionStatement(this)) {
      this._expression.accept(visitor);
    }
    visitor.endVisitExpressionStatement(this);
  }
}
