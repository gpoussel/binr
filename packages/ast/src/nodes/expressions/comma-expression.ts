import { Expression } from "./expression";

export class CommaExpression extends Expression {
  public constructor(private _expressions: Expression[]) {
    super();
  }

  public get expressions(): Expression[] {
    return this._expressions;
  }
}
