import { AstVisitor } from "../../visitor/ast-visitor";
import { EnumDeclarationElement } from "../enum-declaration-element";
import { Type } from "../types";
import { VariableDeclaration } from "../variable-declaration";
import { Statement } from "./statement";

export class InlineEnumDeclarationStatement extends Statement {
  public constructor(
    private _baseType: Type,
    private _alias: string | undefined,
    private _declarations: EnumDeclarationElement[],
    private _variableDeclarations: VariableDeclaration[],
  ) {
    super();
  }

  public get baseType(): Type {
    return this._baseType;
  }

  public get alias(): string | undefined {
    return this._alias;
  }

  public get declarations(): EnumDeclarationElement[] {
    return this._declarations;
  }

  public get variableDeclarations(): VariableDeclaration[] {
    return this._variableDeclarations;
  }

  protected accept0(visitor: AstVisitor): void {
    if (visitor.visitInlineEnumDeclarationStatement(this)) {
      this._baseType.accept(visitor);
      this._declarations.map((s) => s.accept(visitor));
      this._variableDeclarations.map((s) => s.accept(visitor));
    }
    visitor.endVisitInlineEnumDeclarationStatement(this);
  }
}
