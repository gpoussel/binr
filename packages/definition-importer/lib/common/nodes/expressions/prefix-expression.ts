import { Operator } from "../operator";
import { Expression } from "./expression";

export class PrefixExpression extends Expression {
  private _innerExpression: Expression;
  private _operator: Operator;

  public constructor(innerExpression: Expression, operator: Operator) {
    super();
    this._innerExpression = innerExpression;
    this._operator = operator;
  }

  public get innerExpression() {
    return this._innerExpression;
  }

  public get operator() {
    return this._operator;
  }
}
