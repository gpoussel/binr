import { Type } from "../types/type";

export abstract class Node {
  public abstract buildStatement(builtElements: any): any;
  public abstract getTypes(): Type[];
}
