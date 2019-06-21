import { BlockStatement } from "@binr/model";
import _ from "lodash";
import { Node } from "./node";

export class BlockNode extends Node {
  private innerNodes: any;
  constructor(innerNodes) {
    super();
    this.innerNodes = innerNodes;
  }

  public buildStatement(builtElements) {
    return new BlockStatement(
      _.map(this.innerNodes, (innerStatement) => innerStatement.buildStatement(builtElements)),
    );
  }

  public getTypes() {
    return _.flatMap(this.innerNodes, (n) => n.getTypes());
  }
}
