import { AstVisitor } from "../../visitor/ast-visitor";
import { Expression } from "./expression";

export class CommaExpression extends Expression {
  public constructor(private _expressions: Expression[]) {
    super();
  }

  public get expressions(): Expression[] {
    return this._expressions;
  }

  protected accept0(visitor: AstVisitor): void {
    if (visitor.visitCommaExpression(this)) {
      this._expressions.map((s) => s.accept(visitor));
    }
    visitor.endVisitCommaExpression(this);
  }
}
