import { AstVisitor } from "../../../visitor/ast-visitor";
import { ValueExpression } from "./value-expression";

export class IdentifierValueExpression extends ValueExpression {
  public constructor(private _name: string) {
    super();
  }

  public get name() {
    return this._name;
  }

  protected accept0(visitor: AstVisitor): void {
    visitor.visitIdentifierValueExpression(this);
    visitor.endVisitIdentifierValueExpression(this);
  }
}
