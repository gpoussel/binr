import { Expression } from "./expression";

export class TernaryExpression extends Expression {
  public constructor(
    private _condition: Expression,
    private _trueExpression: Expression,
    private _falseExpression: Expression,
  ) {
    super();
  }

  public get condition(): Expression {
    return this._condition;
  }

  public get trueExpression(): Expression {
    return this._trueExpression;
  }

  public get falseExpression(): Expression {
    return this._falseExpression;
  }
}
