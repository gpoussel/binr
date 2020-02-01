import { EvaluationContext, EvaluationInput } from "../../evaluation";
import { AstVisitor } from "../../visitor";
import { Expression } from "./expression";

export class PropertyAccessExpression extends Expression {
  public constructor(private _expression: Expression, private _name: string) {
    super();
  }

  public get expression(): Expression {
    return this._expression;
  }

  public get name(): string {
    return this._name;
  }

  public evaluate(_context: EvaluationContext, _input: EvaluationInput): void {
    // Nothing to do
  }

  protected accept0(visitor: AstVisitor): void {
    if (visitor.visitPropertyAccessExpression(this)) {
      this._expression.accept(visitor);
    }
    visitor.endVisitPropertyAccessExpression(this);
  }
}
