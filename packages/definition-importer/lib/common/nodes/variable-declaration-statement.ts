import { Statement } from "./statement";
import { Expression } from "./expression";

export class VariableDeclarationStatement extends Statement {
  private _expression: Expression;

  public constructor(expression: Expression) {
    super("variableDeclarationStatement");
    this._expression = expression;
  }

  public get expression(): Expression {
    return this._expression;
  }
}
