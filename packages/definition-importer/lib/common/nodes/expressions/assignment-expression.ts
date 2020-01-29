import { AssignmentOperator } from "../assignment-operator";
import { Expression } from "./expression";

export class AssignmentExpression extends Expression {
  public constructor(
    private _left: Expression,
    private _right: Expression,
    private _operator: AssignmentOperator,
  ) {
    super();
  }

  public get left(): Expression {
    return this._left;
  }

  public get right(): Expression {
    return this._right;
  }

  public get operator(): AssignmentOperator {
    return this._operator;
  }
}
