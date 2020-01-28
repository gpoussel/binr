import { Expression } from "./expression";
import { Type } from "./type";

export class SizeofExpression extends Expression {
  private _innerExpression: Expression | Type;

  public constructor(innerExpression: Expression | Type) {
    super();
    this._innerExpression = innerExpression;
  }

  public get innerExpression(): Expression | Type {
    return this._innerExpression;
  }
}
