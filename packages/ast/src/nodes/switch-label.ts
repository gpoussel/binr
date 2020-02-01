import { EvaluationContext } from "../evaluation";
import { AstVisitor } from "../visitor";
import { ValueExpression } from "./expressions";
import { Node } from "./node";

export abstract class SwitchLabel extends Node {}

export class DefaultSwitchLabel extends SwitchLabel {
  public evaluate(_context: EvaluationContext): void {
    // Nothing to do
  }

  protected accept0(visitor: AstVisitor): void {
    visitor.visitDefaultSwitchLabel(this);
    visitor.endVisitDefaultSwitchLabel(this);
  }
}

export class ValueSwitchLabel extends SwitchLabel {
  public constructor(private _value: ValueExpression) {
    super();
  }

  public get value(): ValueExpression {
    return this._value;
  }

  public evaluate(_context: EvaluationContext): void {
    // Nothing to do
  }

  protected accept0(visitor: AstVisitor): void {
    if (visitor.visitValueSwitchLabel(this)) {
      this._value.accept(visitor);
    }
    visitor.endVisitValueSwitchLabel(this);
  }
}
