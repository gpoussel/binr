import { Node } from "./node";
import { Annotation } from "./annotation";

export class VariableDeclarator extends Node {
  private _name: string;
  private _annotations: Annotation[];

  public constructor(name: string, annotations: Annotation[]) {
    super();
    this._name = name;
    this._annotations = annotations;
  }

  public get name(): string {
    return this._name;
  }

  public get annotations(): Annotation[] {
    return this._annotations;
  }
}
