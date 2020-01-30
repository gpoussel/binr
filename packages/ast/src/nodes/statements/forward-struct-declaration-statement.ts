import { AstVisitor } from "../../visitor/ast-visitor";
import { Statement } from "./statement";

export class ForwardStructDeclarationStatement extends Statement {
  public constructor(private _name: string) {
    super();
  }

  public get name(): string | undefined {
    return this._name;
  }

  protected accept0(visitor: AstVisitor): void {
    visitor.visitForwardStructDeclarationStatement(this);
    visitor.endVisitForwardStructDeclarationStatement(this);
  }
}
