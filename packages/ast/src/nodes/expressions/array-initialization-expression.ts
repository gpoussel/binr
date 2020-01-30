import { AstVisitor } from "../../visitor/ast-visitor";
import { Expression } from "./expression";

export class ArrayInitializationExpression extends Expression {
  public constructor(private _elements: Expression[]) {
    super();
  }

  public get elements(): Expression[] {
    return this._elements;
  }

  protected accept0(visitor: AstVisitor): void {
    if (visitor.visitArrayInitializationExpression(this)) {
      this._elements.map((s) => s.accept(visitor));
    }
    visitor.endVisitArrayInitializationExpression(this);
  }
}
