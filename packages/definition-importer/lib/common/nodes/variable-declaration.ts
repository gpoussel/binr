import { Node } from "./node";
import { Annotation } from "./annotation";
import { ArraySelector } from ".";

export class VariableDeclaration extends Node {
  private _name: string;
  private _arraySelector: ArraySelector;
  private _annotations: Annotation[];

  public constructor(name: string, arraySelector: ArraySelector, annotations: Annotation[]) {
    super();
    this._name = name;
    this._arraySelector = arraySelector;
    this._annotations = annotations;
  }

  public get name(): string {
    return this._name;
  }

  public get arraySelector(): ArraySelector {
    return this._arraySelector;
  }

  public get annotations(): Annotation[] {
    return this._annotations;
  }
}
