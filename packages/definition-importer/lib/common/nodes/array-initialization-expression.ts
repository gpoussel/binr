import { Expression } from "./expression";

export class ArrayInitializationExpression extends Expression {
  private _elements: Expression[];

  public constructor(elements: Expression[]) {
    super();
    this._elements = elements;
  }

  public get elements(): Expression[] {
    return this._elements;
  }
}
