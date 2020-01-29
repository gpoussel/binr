import { Expression } from "./expression";

export class FunctionCallExpression extends Expression {
  public constructor(private _callable: Expression, private _functionArguments: Expression[]) {
    super();
  }

  public get callable(): Expression {
    return this._callable;
  }

  public get functionArguments(): Expression[] {
    return this._functionArguments;
  }
}
