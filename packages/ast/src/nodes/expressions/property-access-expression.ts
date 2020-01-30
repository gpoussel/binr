import { Expression } from "./expression";

export class PropertyAccessExpression extends Expression {
  public constructor(private _expression: Expression, private _name: string) {
    super();
  }

  public get expression(): Expression {
    return this._expression;
  }

  public get name(): Expression {
    return this._name;
  }
}
