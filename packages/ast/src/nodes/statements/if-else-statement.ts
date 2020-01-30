import { Expression } from "../expressions";
import { Statement } from "./statement";

export class IfElseStatement extends Statement {
  public constructor(
    private _condition: Expression,
    private _trueStatement: Statement,
    private _falseStatement: Statement,
  ) {
    super();
  }

  public get condition(): Expression {
    return this._condition;
  }

  public get trueStatement(): Statement {
    return this._trueStatement;
  }

  public get falseStatement(): Statement {
    return this._falseStatement;
  }
}
