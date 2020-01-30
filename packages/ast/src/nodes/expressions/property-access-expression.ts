import { AstVisitor } from "../../visitor/ast-visitor";
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

  protected accept0(visitor: AstVisitor): void {
    if (visitor.visitPropertyAccessExpression(this)) {
      this._expression.accept(visitor);
    }
    visitor.endVisitPropertyAccessExpression(this);
  }
}
