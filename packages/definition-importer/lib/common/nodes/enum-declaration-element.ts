import { Node } from "./node";
import { Expression } from "./expression";

export class EnumDeclarationElement extends Node {
  private _name: string;
  private _expression: Expression;

  public constructor(name: string, expression: Expression) {
    super();
    this._name = name;
    this._expression = expression;
  }

  public get name(): string {
    return this._name;
  }

  public get expression(): Expression {
    return this._expression;
  }
}
