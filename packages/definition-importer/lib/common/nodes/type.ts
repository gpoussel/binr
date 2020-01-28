import { Node } from "./node";

export abstract class Type extends Node {
  protected constructor(type: string) {
    super(type);
  }
}
