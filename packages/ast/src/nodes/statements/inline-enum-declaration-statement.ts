import { EvaluationContext, EvaluationInput } from "../../evaluation";
import { AstVisitor } from "../../visitor";
import { EnumDeclarationElement } from "../enum-declaration-element";
import { Type } from "../types";
import { VariableDeclaration } from "../variable-declaration";
import { Statement } from "./statement";

export class InlineEnumDeclarationStatement extends Statement {
  public constructor(
    private _baseType: Type | undefined,
    private _alias: string | undefined,
    private _declarations: EnumDeclarationElement[],
    private _variableDeclarations: VariableDeclaration[],
  ) {
    super();
  }

  public get baseType(): Type | undefined {
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

  public evaluate(_context: EvaluationContext, _input: EvaluationInput): void {
    // Nothing to do
  }

  protected accept0(visitor: AstVisitor): void {
    if (visitor.visitInlineEnumDeclarationStatement(this)) {
      this._baseType?.accept(visitor);
      this._declarations.map((s) => s.accept(visitor));
      this._variableDeclarations.map((s) => s.accept(visitor));
    }
    visitor.endVisitInlineEnumDeclarationStatement(this);
  }
}
