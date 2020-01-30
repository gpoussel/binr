import { Annotation } from "./annotation";
import { ArraySelector } from "./array-selector";
import { Expression } from "./expressions";
import { Node } from "./node";

export class VariableDeclaration extends Node {
  public constructor(
    private _name: string,
    private _bitfield: Expression,
    private _arraySelector: ArraySelector,
    private _typeArguments: Expression[],
    private _initializationExpression: Expression,
    private _annotations: Annotation[],
  ) {
    super();
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
