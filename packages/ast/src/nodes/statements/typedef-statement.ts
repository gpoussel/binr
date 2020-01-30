import { AstVisitor } from "../../visitor/ast-visitor";
import { Annotation } from "../annotation";
import { ArraySelector } from "../array-selector";
import { Type } from "../types";
import { Statement } from "./statement";

export class TypedefStatement extends Statement {
  public constructor(
    private _type: Type,
    private _alias: string,
    private _arraySelector?: ArraySelector,
    private _annotations: Annotation[] = [],
  ) {
    super();
  }

  public get type(): Type {
    return this._type;
  }

  public get alias(): string {
    return this._alias;
  }

  public get arraySelector(): ArraySelector | undefined {
    return this._arraySelector;
  }

  public get annotations(): Annotation[] {
    return this._annotations;
  }

  protected accept0(visitor: AstVisitor): void {
    if (visitor.visitTypedefStatement(this)) {
      this._type.accept(visitor);
      if (this._arraySelector) {
        this._arraySelector.accept(visitor);
      }
      this._annotations.map((s) => s.accept(visitor));
    }
    visitor.endVisitTypedefStatement(this);
  }
}
