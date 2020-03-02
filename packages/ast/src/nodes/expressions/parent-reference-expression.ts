import { EvaluationContext, EvaluationInput, EvaluationResult } from "../../evaluation";
import { AstVisitor } from "../../visitor";
import { Type } from "../types";
import { Expression } from "./expression";

export class ParentReferenceExpression extends Expression {
  public constructor(private _innerExpression: Expression | Type) {
    super();
  }

  public get innerExpression(): Expression | Type {
    return this._innerExpression;
  }

  public evaluate(_context: EvaluationContext, _input: EvaluationInput): EvaluationResult {
    // Nothing to do
    return {};
  }

  protected accept0(visitor: AstVisitor): void {
    if (visitor.visitParentReferenceExpression(this)) {
      this._innerExpression.accept(visitor);
    }
    visitor.endVisitParentReferenceExpression(this);
  }
}
