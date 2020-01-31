import { AstVisitor } from "../../../visitor/ast-visitor";
import { ValueExpression } from "./value-expression";

export class ThisValueExpression extends ValueExpression {
  public constructor() {
    super();
  }

  protected accept0(visitor: AstVisitor): void {
    visitor.visitThisValueExpression(this);
    visitor.endVisitThisValueExpression(this);
  }
}
