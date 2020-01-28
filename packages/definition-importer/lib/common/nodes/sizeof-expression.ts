import { Expression } from "./expression";

export class SizeofExpression extends Expression {
  private _innerExpression: Expression;

  public constructor(innerExpression: Expression) {
    super();
    this._innerExpression = innerExpression;
  }

  public get innerExpression() {
    return this._innerExpression;
  }
}
