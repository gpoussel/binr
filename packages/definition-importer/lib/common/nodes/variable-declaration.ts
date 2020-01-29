import { Node } from "./node";
import { Annotation } from "./annotation";
import { ArraySelector } from "./array-selector";
import { Expression } from "./expression";

export class VariableDeclaration extends Node {
  private _name: string;
  private _arraySelector: ArraySelector;
  private _initializationExpression: Expression;
  private _annotations: Annotation[];

  public constructor(
    name: string,
    arraySelector: ArraySelector,
    initializationExpression: Expression,
    annotations: Annotation[],
  ) {
    super();
    this._name = name;
    this._arraySelector = arraySelector;
    this._initializationExpression = initializationExpression;
    this._annotations = annotations;
  }

  public get name(): string {
    return this._name;
  }

  public get arraySelector(): ArraySelector {
    return this._arraySelector;
  }

  public get initializationExpression(): Expression {
    return this._initializationExpression;
  }

  public get annotations(): Annotation[] {
    return this._annotations;
  }
}
