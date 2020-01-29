import { Node } from "./node";
import { Annotation } from "./annotation";
import { ArraySelector } from "./array-selector";
import { Expression } from "./expression";

export class VariableDeclaration extends Node {
  private _name: string;
  private _bitfield: Expression;
  private _arraySelector: ArraySelector;
  private _typeArguments: Expression[];
  private _initializationExpression: Expression;
  private _annotations: Annotation[];

  public constructor(
    name: string,
    bitfield: Expression,
    arraySelector: ArraySelector,
    typeArguments: Expression[],
    initializationExpression: Expression,
    annotations: Annotation[],
  ) {
    super();
    this._name = name;
    this._bitfield = bitfield;
    this._arraySelector = arraySelector;
    this._typeArguments = typeArguments;
    this._initializationExpression = initializationExpression;
    this._annotations = annotations;
  }

  public get name(): string {
    return this._name;
  }

  public get bitfield(): Expression {
    return this._bitfield;
  }

  public get arraySelector(): ArraySelector {
    return this._arraySelector;
  }

  public get typeArguments(): Expression[] {
    return this._typeArguments;
  }

  public get initializationExpression(): Expression {
    return this._initializationExpression;
  }

  public get annotations(): Annotation[] {
    return this._annotations;
  }
}
