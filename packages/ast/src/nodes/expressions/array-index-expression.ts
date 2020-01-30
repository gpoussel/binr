import { Expression } from "./expression";

export class ArrayIndexExpression extends Expression {
  public constructor(private _expression: Expression, private _indexExpression: Expression) {
    super();
  }

  public get expression(): Expression {
    return this._expression;
  }

  public get indexExpression(): Expression {
    return this._indexExpression;
  }
}
