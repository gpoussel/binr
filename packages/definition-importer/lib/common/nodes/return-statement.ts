import { Statement } from "./statement";
import { Expression } from "./expression";

export class ReturnStatement extends Statement {
  private _expression: Expression | undefined;

  public constructor(expression?: Expression) {
    super();
    this._expression = expression;
  }

  public get expression(): Expression | undefined {
    return this._expression;
  }
}
