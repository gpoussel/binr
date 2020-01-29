import { Expression } from "./expression";
import { Node } from "./node";

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
