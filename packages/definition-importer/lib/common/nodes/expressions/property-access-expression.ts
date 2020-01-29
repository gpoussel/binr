import { Expression } from "./expression";

export class PropertyAccessExpression extends Expression {
  private _expression: Expression;
  private _name: string;

  public constructor(expression: Expression, name: string) {
    super();
    this._expression = expression;
    this._name = name;
  }

  public get expression(): Expression {
    return this._expression;
  }

  public get name(): Expression {
    return this._name;
  }
}
