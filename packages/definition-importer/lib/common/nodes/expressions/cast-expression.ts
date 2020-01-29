import { Expression } from "./expression";

export class CastExpression extends Expression {
  public constructor(private _castExpression: Expression, private _innerExpression: Expression) {
    super();
  }

  public get castExpression(): Expression {
    return this._castExpression;
  }

  public get innerExpression() {
    return this._innerExpression;
  }
}
