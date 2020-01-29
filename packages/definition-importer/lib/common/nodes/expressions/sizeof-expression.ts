import { Type } from "../type";
import { Expression } from "./expression";

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
