import { Expression } from "./expression";

export class ArrayInitializationExpression extends Expression {
  public constructor(private _elements: Expression[]) {
    super();
  }

  public get elements(): Expression[] {
    return this._elements;
  }
}
