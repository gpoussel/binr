import { Node } from "./node";

export abstract class Expression extends Node {
  protected constructor(type: string) {
    super(type);
  }
}
