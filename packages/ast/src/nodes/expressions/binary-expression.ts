import { Operator } from "../operator";
import { Expression } from "./expression";

export class BinaryExpression extends Expression {
  public constructor(private _left: Expression, private _right: Expression, private _operator: Operator) {
    super();
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
