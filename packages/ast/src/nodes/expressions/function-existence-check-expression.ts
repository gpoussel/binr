import { AstVisitor } from "../../visitor/ast-visitor";
import { Expression } from "./expression";

export class FunctionExistenceCheckExpression extends Expression {
  public constructor(private _functionName: string) {
    super();
  }

  public get functionName(): string {
    return this._functionName;
  }

  protected accept0(visitor: AstVisitor): void {
    visitor.visitFunctionExistenceCheckExpression(this);
    visitor.endVisitFunctionExistenceCheckExpression(this);
  }
}
