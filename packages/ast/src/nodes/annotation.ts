import { EvaluationContext, EvaluationInput } from "../evaluation";
import { AstVisitor } from "../visitor";
import { ValueExpression } from "./expressions/values";
import { Node } from "./node";

export class Annotation extends Node {
  public constructor(private _key: string, private _value: ValueExpression) {
    super();
  }

  public get key() {
    return this._key;
  }

  public get value() {
    return this._value;
  }

  public evaluate(_context: EvaluationContext, _input: EvaluationInput): void {
    // Nothing to do
  }

  protected accept0(visitor: AstVisitor): void {
    const children = visitor.visitAnnotation(this);
    if (children) {
      this._value.accept(visitor);
    }
    visitor.endVisitAnnotation(this);
  }
}
