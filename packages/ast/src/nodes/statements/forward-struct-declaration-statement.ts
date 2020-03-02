import { EvaluationContext, EvaluationInput, EvaluationResult } from "../../evaluation";
import { AstVisitor } from "../../visitor";
import { Statement } from "./statement";

export class ForwardStructDeclarationStatement extends Statement {
  public constructor(private _name: string) {
    super();
  }

  public get name(): string {
    return this._name;
  }

  public evaluate(_context: EvaluationContext, _input: EvaluationInput): EvaluationResult {
    // Nothing to do
    return {};
  }

  protected accept0(visitor: AstVisitor): void {
    visitor.visitForwardStructDeclarationStatement(this);
    visitor.endVisitForwardStructDeclarationStatement(this);
  }
}
