import { Expression } from "../expressions";
import { Statement } from "./statement";

export class IfStatement extends Statement {
  public constructor(private _condition: Expression, private _trueStatement: Statement) {
    super();
  }

  public get condition(): Expression {
    return this._condition;
  }

  public get trueStatement(): Statement {
    return this._trueStatement;
  }
}
