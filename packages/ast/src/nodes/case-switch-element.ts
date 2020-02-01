import { EvaluationContext, EvaluationInput } from "../evaluation";
import { AstVisitor } from "../visitor";
import { Node } from "./node";
import { Statement } from "./statements";
import { SwitchLabel } from "./switch-label";

export class CaseSwitchElement extends Node {
  public constructor(private _labels: SwitchLabel[], private _statements: Statement[]) {
    super();
  }

  public get labels(): SwitchLabel[] {
    return this._labels;
  }

  public get statements(): Statement[] {
    return this._statements;
  }

  public evaluate(_context: EvaluationContext, _input: EvaluationInput): void {
    // Nothing to do
  }

  protected accept0(visitor: AstVisitor): void {
    if (visitor.visitCaseSwitchElement(this)) {
      this._labels.map((s) => s.accept(visitor));
      this._statements.map((s) => s.accept(visitor));
    }
    visitor.endVisitCaseSwitchElement(this);
  }
}
