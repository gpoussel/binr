import { Statement } from "./statement";
import { Expression } from "./expression";

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
