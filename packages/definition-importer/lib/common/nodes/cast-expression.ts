import { Expression } from "./expression";

export class CastExpression extends Expression {
  private _castExpression: Expression;
  private _innerExpression: Expression;

  public constructor(castExpression: Expression, innerExpression: Expression) {
    super("castExpression");
    this._castExpression = castExpression;
    this._innerExpression = innerExpression;
  }

  public get castExpression(): Expression {
    return this._castExpression;
  }

  public get innerExpression() {
    return this._innerExpression;
  }
}
