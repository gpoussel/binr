import { Expression } from "./expression";

export class CommaExpression extends Expression {
  private _expressions: Expression[];

  public constructor(expressions: Expression[]) {
    super();
    this._expressions = expressions;
  }

  public get expressions(): Expression[] {
    return this._expressions;
  }
}
