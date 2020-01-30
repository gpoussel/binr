import { AstVisitor } from "../../visitor/ast-visitor";
import { Operator } from "../operator";
import { Expression } from "./expression";

export class PostfixExpression extends Expression {
  public constructor(private _innerExpression: Expression, private _operator: Operator) {
    super();
  }

  public get innerExpression() {
    return this._innerExpression;
  }

  public get operator() {
    return this._operator;
  }

  protected accept0(visitor: AstVisitor): void {
    if (visitor.visitPostfixExpression(this)) {
      this._innerExpression.accept(visitor);
    }
    visitor.endVisitPostfixExpression(this);
  }
}
