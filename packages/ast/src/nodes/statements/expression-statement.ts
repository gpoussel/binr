import { Expression } from "../expressions";
import { Statement } from "./statement";

export class ExpressionStatement extends Statement {
  public constructor(private _expression: Expression) {
    super();
  }

  public get expression(): Expression {
    return this._expression;
  }
}
