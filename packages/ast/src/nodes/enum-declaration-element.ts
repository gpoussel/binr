import { EvaluationContext } from "../evaluation";
import { AstVisitor } from "../visitor";
import { Expression } from "./expressions";
import { Node } from "./node";

export class EnumDeclarationElement extends Node {
  public constructor(private _name: string, private _expression: Expression | undefined) {
    super();
  }

  public get name(): string {
    return this._name;
  }

  public get expression(): Expression | undefined {
    return this._expression;
  }

  public evaluate(_context: EvaluationContext): void {
    // Nothing to do
  }

  protected accept0(visitor: AstVisitor): void {
    if (visitor.visitEnumDeclarationElement(this)) {
      this._expression?.accept(visitor);
    }
    visitor.endVisitEnumDeclarationElement(this);
  }
}
