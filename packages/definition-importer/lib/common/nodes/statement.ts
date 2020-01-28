import { Node } from "./node";

export abstract class Statement extends Node {
  protected constructor(type: string) {
    super(type);
  }
}
