import { EvaluationContext, EvaluationInput } from "../../../evaluation";
import { AstVisitor } from "../../../visitor";
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

  public evaluate(_context: EvaluationContext, _input: EvaluationInput): void {
    // Nothing to do
  }

  protected accept0(visitor: AstVisitor): void {
    if (visitor.visitExpressionArrayValueElement(this)) {
      this._expression.accept(visitor);
    }
    visitor.endVisitExpressionArrayValueElement(this);
  }
}

export class UndefinedArrayValueElement extends ArrayValueElement {
  public evaluate(_context: EvaluationContext, _input: EvaluationInput): void {
    // Nothing to do
  }

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

  public evaluate(_context: EvaluationContext, _input: EvaluationInput): void {
    // Nothing to do
  }

  protected accept0(visitor: AstVisitor): void {
    if (visitor.visitArrayValueExpression(this)) {
      this._elements.map((s) => s.accept(visitor));
    }
    visitor.endVisitArrayValueExpression(this);
  }
}
