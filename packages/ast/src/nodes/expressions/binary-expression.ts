import { EvaluationContext, EvaluationInput } from "../../evaluation";
import { AstVisitor } from "../../visitor";
import { Operator } from "../operator";
import { Expression } from "./expression";

export class BinaryExpression extends Expression {
  public constructor(private _left: Expression, private _right: Expression, private _operator: Operator) {
    super();
  }

  public get left() {
    return this._left;
  }

  public get right() {
    return this._right;
  }

  public get operator() {
    return this._operator;
  }

  public evaluate(_context: EvaluationContext, _input: EvaluationInput): void {
    // Nothing to do
  }

  protected accept0(visitor: AstVisitor): void {
    if (visitor.visitBinaryExpression(this)) {
      this._left.accept(visitor);
      this._right.accept(visitor);
    }
    visitor.endVisitBinaryExpression(this);
  }
}
