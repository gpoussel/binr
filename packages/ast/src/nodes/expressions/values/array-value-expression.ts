import { Node } from "../../node";
import { ValueExpression } from "./value-expression";
import { Expression } from "..";

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

export class ArrayValueExpression extends ValueExpression {
  public constructor(private _elements: ArrayValueElement[]) {
    super();
  }

  public get elements(): ArrayValueElement {
    return this._elements;
  }
}
