import { AstVisitor } from "../../visitor/ast-visitor";
import { ParameterDeclaration } from "../parameter-declaration";
import { Type } from "../types";
import { BlockStatement } from "./block-statement";
import { Statement } from "./statement";

export class FunctionDeclarationStatement extends Statement {
  public constructor(
    private _returnType: Type,
    private _name: string,
    private _parameters: ParameterDeclaration[],
    private _body: BlockStatement,
  ) {
    super();
  }

  public get returnType(): Type {
    return this._returnType;
  }

  public get name(): string {
    return this._name;
  }

  public get parameters(): ParameterDeclaration[] {
    return this._parameters;
  }

  public get body(): BlockStatement {
    return this._body;
  }

  protected accept0(visitor: AstVisitor): void {
    if (visitor.visitFunctionDeclarationStatement(this)) {
      this._returnType.accept(visitor);
      this._parameters.map((s) => s.accept(visitor));
      this._body?.accept(visitor);
    }
    visitor.endVisitFunctionDeclarationStatement(this);
  }
}
