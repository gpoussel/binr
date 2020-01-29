import { Expression } from "../expressions";
import { Statement } from "./statement";
import { CommaExpression } from "..";

export class ForStatement extends Statement {
  public constructor(
    private _initialization: CommaExpression,
    private _condition: Expression,
    private _increment: CommaExpression,
    private _body: Statement,
  ) {
    super();
  }

  public get initialization(): CommaExpression {
    return this._initialization;
  }

  public get condition(): Expression {
    return this._condition;
  }

  public get increment(): CommaExpression {
    return this._increment;
  }

  public get body(): Statement {
    return this._body;
  }
}
