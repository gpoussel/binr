import { AstVisitor } from "../../../visitor/ast-visitor";
import { Node } from "../../node";
import { ValueExpression } from "./value-expression";
import { Expression } from "..";

export abstract class ArrayValueElement extends Node {}

export class ExpressionArrayValueElement extends ArrayValueElement {
  public constructor(private _expression: Expression) {
    super();
  }

  public get expression(): Expression {
    return this._expression;
  }

  protected accept0(visitor: AstVisitor): void {
    if (visitor.visitExpressionArrayValueElement(this)) {
      visitor.visitExpression(this._expression);
    }
    visitor.endVisitExpressionArrayValueElement(this);
  }
}

export class UndefinedArrayValueElement extends ArrayValueElement {
  protected accept0(visitor: AstVisitor): void {
    visitor.visitUndefinedArrayValueElement(this);
    visitor.endVisitUndefinedArrayValueElement(this);
  }
}

export class ArrayValueExpression extends ValueExpression {
  public constructor(private _elements: ArrayValueElement[]) {
    super();
  }

  public get elements(): ArrayValueElement[] {
    return this._elements;
  }

  protected accept0(visitor: AstVisitor): void {
    if (visitor.visitArrayValueExpression(this)) {
      this._elements.map((s) => visitor.visitArrayValueElement(s));
    }
    visitor.endVisitArrayValueExpression(this);
  }
}
