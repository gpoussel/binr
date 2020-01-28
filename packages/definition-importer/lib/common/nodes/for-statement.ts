import { Statement } from "./statement";
import { Expression } from "./expression";
import { CommaExpression } from ".";

export class ForStatement extends Statement {
  private _initialization: CommaExpression;
  private _condition: Expression;
  private _incremnt: CommaExpression;
  private _body: Statement;

  public constructor(
    initialization: CommaExpression,
    condition: Expression,
    increment: CommaExpression,
    body: Statement,
  ) {
    super();
    this._initialization = initialization;
    this._condition = condition;
    this._incremnt = increment;
    this._body = body;
  }

  public get initialization(): CommaExpression {
    return this._initialization;
  }

  public get condition(): Expression {
    return this._condition;
  }

  public get increment(): CommaExpression {
    return this._incremnt;
  }

  public get body(): Statement {
    return this._body;
  }
}
