import { Node } from "./node";

export class Annotation extends Node {
  private _key: string;

  public constructor(key: string) {
    super("annotation");
    this._key = key;
  }

  public get key() {
    return this._key;
  }
}
