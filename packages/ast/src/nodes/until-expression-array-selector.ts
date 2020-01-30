import { ArraySelector } from "./array-selector";
import { Expression } from "./expressions";

export class UntilExpressionArraySelector extends ArraySelector {
  public constructor(private _innerExpression: Expression) {
    super();
  }

  public get innerExpression(): Expression {
    return this._innerExpression;
  }
}
