import { Expression } from "./expression";

export class FunctionCallExpression extends Expression {
  private _callable: Expression;
  private _functionArguments: Expression[];

  public constructor(callable: Expression, functionArguments: Expression[]) {
    super();
    this._callable = callable;
    this._functionArguments = functionArguments;
  }

  public get callable(): Expression {
    return this._callable;
  }

  public get functionArguments(): Expression[] {
    return this._functionArguments;
  }
}
