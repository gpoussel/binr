import { Expression } from "./expression";

export class TernaryExpression extends Expression {
  private _condition: Expression;
  private _trueExpression: Expression;
  private _falseExpression: Expression;

  public constructor(condition: Expression, trueExpression: Expression, falseExpression: Expression) {
    super();
    this._condition = condition;
    this._trueExpression = trueExpression;
    this._falseExpression = falseExpression;
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
