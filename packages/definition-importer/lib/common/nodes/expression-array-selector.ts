import { ArraySelector } from "./array-selector";
import { Expression } from "./expressions";

export class ExpressionArraySelector extends ArraySelector {
  private _innerExpression: Expression;

  public constructor(innerExpression: Expression) {
    super();
    this._innerExpression = innerExpression;
  }

  public get innerExpression(): Expression {
    return this._innerExpression;
  }
}
