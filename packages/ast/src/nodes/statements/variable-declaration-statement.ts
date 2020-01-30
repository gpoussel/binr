import { AstVisitor } from "../../visitor/ast-visitor";
import { Annotation } from "../annotation";
import { Expression } from "../expressions";
import { Type } from "../types";
import { VariableDeclaration } from "../variable-declaration";
import { VariableModifier } from "../variable-modifier";
import { Statement } from "./statement";

export class VariableDeclarationStatement extends Statement {
  public constructor(
    private _variableType: Type,
    private _modifiers: VariableModifier[],
    private _bitfield: Expression | undefined,
    private _variableDeclarations: VariableDeclaration[],
    private _annotations: Annotation[],
  ) {
    super();
  }

  public get variableType(): Type {
    return this._variableType;
  }

  public get modifiers(): VariableModifier[] {
    return this._modifiers;
  }

  public get bitfield(): Expression | undefined {
    return this._bitfield;
  }

  public get variableDeclarations(): VariableDeclaration[] {
    return this._variableDeclarations;
  }

  public get annotations(): Annotation[] {
    return this._annotations;
  }

  protected accept0(visitor: AstVisitor): void {
    if (visitor.visitVariableDeclarationStatement(this)) {
      this._variableType.accept(visitor);
      if (this._bitfield) {
        this._bitfield.accept(visitor);
      }
      this._variableDeclarations.map((s) => s.accept(visitor));
      this._annotations.map((s) => s.accept(visitor));
    }
    visitor.endVisitVariableDeclarationStatement(this);
  }
}
