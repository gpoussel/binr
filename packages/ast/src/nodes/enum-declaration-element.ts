import { Expression } from "./expressions";
import { Node } from "./node";

export class EnumDeclarationElement extends Node {
  public constructor(private _name: string, private _expression: Expression) {
    super();
  }

  public get name(): string {
    return this._name;
  }

  public get expression(): Expression {
    return this._expression;
  }
}
