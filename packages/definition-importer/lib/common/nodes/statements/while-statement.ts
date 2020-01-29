import { Expression } from "../expression";
import { Statement } from "./statement";

export class WhileStatement extends Statement {
  private _condition: Expression;
  private _body: Statement;

  public constructor(condition: Expression, body: Statement) {
    super();
    this._condition = condition;
    this._body = body;
  }

  public get condition(): Expression {
    return this._condition;
  }

  public get body(): Statement {
    return this._body;
  }
}
