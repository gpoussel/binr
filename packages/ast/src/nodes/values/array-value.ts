import { Expression } from "../expressions";
import { Node } from "../node";
import { Value } from "./value";

export class ArrayValueElement extends Node {}

export class ExpressionArrayValueElement extends ArrayValueElement {
  public constructor(private _expression: Expression) {
    super();
  }

  public get expression(): Expression {
    return this._expression;
  }
}

export class UndefinedArrayValueElement extends ArrayValueElement {}

export class ArrayValue extends Value {
  public constructor(private _elements: ArrayValueElement[]) {
    super();
  }

  public get elements(): ArrayValueElement {
    return this._elements;
  }
}
