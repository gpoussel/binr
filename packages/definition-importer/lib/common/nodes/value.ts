import { Node } from "./node";

export abstract class Value extends Node {
  protected constructor(type: string) {
    super(type);
  }
}
