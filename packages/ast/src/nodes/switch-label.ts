import { AstVisitor } from "../visitor/ast-visitor";
import { ValueExpression } from "./expressions";
import { Node } from "./node";

export abstract class SwitchLabel extends Node {}

export class DefaultSwitchLabel extends SwitchLabel {
  protected accept0(visitor: AstVisitor): void {
    visitor.visitDefaultSwitchLabel(this);
    visitor.visitDefaultSwitchLabel(this);
  }
}

export class ValueSwitchLabel extends SwitchLabel {
  public constructor(private _value: ValueExpression) {
    super();
  }

  public get value(): ValueExpression {
    return this._value;
  }

  protected accept0(visitor: AstVisitor): void {
    if (visitor.visitValueSwitchLabel(this)) {
      this._value.accept(visitor);
    }
    visitor.endVisitValueSwitchLabel(this);
  }
}
