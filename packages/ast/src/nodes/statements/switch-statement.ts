import { EvaluationContext } from "../../evaluation";
import { AstVisitor } from "../../visitor";
import { CaseSwitchElement } from "../case-switch-element";
import { Expression } from "../expressions";
import { Statement } from "./statement";

export class SwitchStatement extends Statement {
  public constructor(private _testExpression: Expression, private _caseSwitchElements: CaseSwitchElement[]) {
    super();
  }

  public get testExpression(): Expression {
    return this._testExpression;
  }

  public get caseSwitchElements(): CaseSwitchElement[] {
    return this._caseSwitchElements;
  }

  public evaluate(_context: EvaluationContext): void {
    // Nothing to do
  }

  protected accept0(visitor: AstVisitor): void {
    if (visitor.visitSwitchStatement(this)) {
      this._testExpression.accept(visitor);
      this._caseSwitchElements.map((s) => s.accept(visitor));
    }
    visitor.endVisitSwitchStatement(this);
  }
}
