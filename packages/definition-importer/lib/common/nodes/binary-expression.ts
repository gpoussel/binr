import { Expression } from "./expression";
import { Operator } from "./operator";

export class BinaryExpression extends Expression {
  private _left: Expression;
  private _right: Expression;
  private _operator: Operator;

  public constructor(left: Expression, right: Expression, operator: Operator) {
    super();
    this._left = left;
    this._right = right;
    this._operator = operator;
  }

  public get left() {
    return this._left;
  }

  public get right() {
    return this._right;
  }

  public get operator() {
    return this._operator;
  }
}
