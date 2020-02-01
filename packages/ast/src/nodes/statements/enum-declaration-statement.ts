import { EvaluationContext } from "../../evaluation";
import { AstVisitor } from "../../visitor";
import { Annotation } from "../annotation";
import { EnumDeclarationElement } from "../enum-declaration-element";
import { Type } from "../types";
import { Statement } from "./statement";

export class EnumDeclarationStatement extends Statement {
  public constructor(
    private _baseType: Type | undefined,
    private _name: string,
    private _declarations: EnumDeclarationElement[],
    private _annotations: Annotation[],
  ) {
    super();
  }

  public get baseType(): Type | undefined {
    return this._baseType;
  }

  public get name(): string {
    return this._name;
  }

  public get declarations(): EnumDeclarationElement[] {
    return this._declarations;
  }

  public get annotations(): Annotation[] {
    return this._annotations;
  }

  public evaluate(_context: EvaluationContext): void {
    // Nothing to do
  }

  protected accept0(visitor: AstVisitor): void {
    if (visitor.visitEnumDeclarationStatement(this)) {
      this._baseType?.accept(visitor);
      this._declarations.map((s) => s.accept(visitor));
      this._annotations.map((s) => s.accept(visitor));
    }
    visitor.endVisitEnumDeclarationStatement(this);
  }
}
