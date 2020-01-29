import { IfStatement } from "@binr/model";
import { concat, has, isUndefined } from "lodash";

import { ExpressionConverter } from "../expression-converter";
import { Node } from "./node";

export class IfNode extends Node {
  private test: any;
  private consequent: Node;
  private alternate: Node;
  private converter: any;

  constructor(test: string, consequent: Node, alternate: Node) {
    super();
    this.test = test;
    this.consequent = consequent;
    this.alternate = alternate;
    this.converter = new ExpressionConverter();
  }

  public buildStatement(builtElements: any) {
    const testCode = this.converter.transformCodeToFunction(this.test);
    const consequentStatement = this.consequent.buildStatement(builtElements);
    const alternateStatement =
      has(this, "alternate") && !isUndefined(this.alternate)
        ? this.alternate.buildStatement(builtElements)
        : undefined;
    return new IfStatement(testCode, consequentStatement, alternateStatement);
  }

  public getTypes() {
    return concat(this.consequent.getTypes(), this.alternate ? this.alternate.getTypes() : []);
  }
}
