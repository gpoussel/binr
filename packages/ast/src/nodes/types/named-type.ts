import { EvaluationContext } from "../../evaluation";
import { AstVisitor } from "../../visitor";
import { Type } from "./type";
import { TypeModifier } from "./type-modifier";

export class NamedType extends Type {
  public constructor(private _name: string, private _modifiers: TypeModifier[], private _array: boolean) {
    super();
  }

  public get name() {
    return this._name;
  }

  public get modifiers() {
    return this._modifiers;
  }

  public get array() {
    return this._array;
  }

  public evaluate(_context: EvaluationContext): void {
    // Nothing to do
  }

  protected accept0(visitor: AstVisitor): void {
    visitor.visitNamedType(this);
    visitor.endVisitNamedType(this);
  }
}
