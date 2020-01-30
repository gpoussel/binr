import { AstVisitor } from "../../visitor/ast-visitor";
import { Expression } from "./expression";

export class ArrayIndexExpression extends Expression {
  public constructor(private _expression: Expression, private _indexExpression: Expression) {
    super();
  }

  public get expression(): Expression {
    return this._expression;
  }

  public get indexExpression(): Expression {
    return this._indexExpression;
  }

  protected accept0(visitor: AstVisitor): void {
    if (visitor.visitArrayIndexExpression(this)) {
      this._expression?.accept(visitor);
      this._indexExpression?.accept(visitor);
    }
    visitor.endVisitArrayIndexExpression(this);
  }
}
