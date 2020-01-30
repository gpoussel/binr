import { AstVisitor } from "../../visitor/ast-visitor";
import { Statement } from "./statement";

export class BlockStatement extends Statement {
  public constructor(private _content: Statement[]) {
    super();
  }

  public get content(): Statement[] {
    return this._content;
  }

  protected accept0(visitor: AstVisitor): void {
    if (visitor.visitBlockStatement(this)) {
      this._content.map((s) => s.accept(visitor));
    }
    visitor.endVisitBlockStatement(this);
  }
}
