import { AstVisitor } from "../../visitor/ast-visitor";
import { Expression } from "../expressions";
import { Statement } from "./statement";

export class ReturnStatement extends Statement {
  public constructor(private _expression?: Expression) {
    super();
  }

  public get expression(): Expression | undefined {
    return this._expression;
  }

  protected accept0(visitor: AstVisitor): void {
    if (visitor.visitReturnStatement(this)) {
      if (this._expression) {
        this._expression.accept(visitor);
      }
    }
    visitor.endVisitReturnStatement(this);
  }
}
