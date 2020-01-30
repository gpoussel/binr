import { Operator } from "../operator";
import { Expression } from "./expression";

export class PrefixExpression extends Expression {
  public constructor(private _innerExpression: Expression, private _operator: Operator) {
    super();
  }

  public get innerExpression() {
    return this._innerExpression;
  }

  public get operator() {
    return this._operator;
  }
}
