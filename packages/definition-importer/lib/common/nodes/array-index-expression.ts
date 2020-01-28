import { Expression } from "./expression";

export class ArrayIndexExpression extends Expression {
  private _expression: Expression;
  private _indexExpression: Expression;

  public constructor(expression: Expression, indexExpression: Expression) {
    super();
    this._expression = expression;
    this._indexExpression = indexExpression;
  }

  public get expression(): Expression {
    return this._expression;
  }

  public get indexExpression(): Expression {
    return this._indexExpression;
  }
}
