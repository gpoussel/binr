import { Expression } from "../expression";
import { Statement } from "./statement";

export class ExpressionStatement extends Statement {
  private _expression: Expression;

  public constructor(expression: Expression) {
    super();
    this._expression = expression;
  }

  public get expression(): Expression {
    return this._expression;
  }
}
