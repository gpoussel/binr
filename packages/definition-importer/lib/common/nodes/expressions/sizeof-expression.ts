import { Type } from "../types";
import { Expression } from "./expression";

export class SizeofExpression extends Expression {
  public constructor(private _innerExpression: Expression | Type) {
    super();
  }

  public get innerExpression(): Expression | Type {
    return this._innerExpression;
  }
}
