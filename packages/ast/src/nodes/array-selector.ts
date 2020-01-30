import { Expression } from "./expressions";
import { Node } from "./node";

export abstract class ArraySelector extends Node {}

export class EmptyArraySelector extends ArraySelector {}

export class ExpressionArraySelector extends ArraySelector {
  public constructor(private _innerExpression: Expression) {
    super();
  }

  public get innerExpression(): Expression {
    return this._innerExpression;
  }
}

export class UntilExpressionArraySelector extends ArraySelector {
  public constructor(private _innerExpression: Expression) {
    super();
  }

  public get innerExpression(): Expression {
    return this._innerExpression;
  }
}
