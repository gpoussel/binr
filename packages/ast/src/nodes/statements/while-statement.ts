import { AstVisitor } from "../../visitor/ast-visitor";
import { Expression } from "../expressions";
import { Statement } from "./statement";

export class WhileStatement extends Statement {
  public constructor(private _condition: Expression, private _body: Statement) {
    super();
  }

  public get condition(): Expression {
    return this._condition;
  }

  public get body(): Statement {
    return this._body;
  }

  protected accept0(visitor: AstVisitor): void {
    if (visitor.visitWhileStatement(this)) {
      this._condition.accept(visitor);
      this._body.accept(visitor);
    }
    visitor.endVisitWhileStatement(this);
  }
}
