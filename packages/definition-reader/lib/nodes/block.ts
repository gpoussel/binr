import { BlockStatement } from "@binr/model";
import { flatMap, map } from "lodash";
import { Node } from "./node";

export class BlockNode extends Node {
  private innerNodes: any;
  constructor(innerNodes) {
    super();
    this.innerNodes = innerNodes;
  }

  public buildStatement(builtElements) {
    return new BlockStatement(
      map(this.innerNodes, (innerStatement) => innerStatement.buildStatement(builtElements)),
    );
  }

  public getTypes() {
    return flatMap(this.innerNodes, (n) => n.getTypes());
  }
}
