import { Expression } from "./expression";
import { Statement } from "./statement";

export class IfStatement extends Statement {
  private _condition: Expression;
  private _trueStatement: Statement;
  private _falseStatement: Statement | undefined;

  public constructor(condition: Expression, trueStatement: Statement, falseStatement?: Statement) {
    super();
    this._condition = condition;
    this._trueStatement = trueStatement;
    this._falseStatement = falseStatement;
  }

  public get condition(): Expression {
    return this._condition;
  }

  public get trueStatement(): Statement {
    return this._trueStatement;
  }

  public get falseStatement(): Statement | undefined {
    return this._falseStatement;
  }
}
