import { EvaluationContext, EvaluationInput } from "../evaluation";
import { AstVisitor } from "../visitor";
import { ArraySelector } from "./array-selector";
import { Node } from "./node";
import { NamedType } from "./types/named-type";
import { VariableModifier } from "./variable-modifier";

export class ParameterDeclaration extends Node {
  public constructor(
    private _type: NamedType,
    private _name: string,
    private _arraySelector: ArraySelector | undefined,
    private _byReference: boolean,
    private _modifiers: VariableModifier[],
  ) {
    super();
  }

  public get type(): NamedType {
    return this._type;
  }

  public get name(): string {
    return this._name;
  }

  public get arraySelector(): ArraySelector | undefined {
    return this._arraySelector;
  }

  public get byReference(): boolean {
    return this._byReference;
  }

  public get modifiers(): VariableModifier[] {
    return this._modifiers;
  }

  public evaluate(_context: EvaluationContext, _input: EvaluationInput): void {
    // Nothing to do
  }

  protected accept0(visitor: AstVisitor): void {
    if (visitor.visitParameterDeclaration(this)) {
      this._type.accept(visitor);
      this._arraySelector?.accept(visitor);
    }
    visitor.endVisitParameterDeclaration(this);
  }
}
