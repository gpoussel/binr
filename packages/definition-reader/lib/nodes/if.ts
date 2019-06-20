"use strict";

import { IfStatement } from "@binr/model";
import _ from "lodash";
import { ExpressionConverter } from "../expression-converter";
import { Node } from "./node";

export class IfNode extends Node {
  private test: any;
  private consequent: any;
  private alternate: any;
  private converter: any;

  constructor(test, consequent, alternate) {
    super();
    this.test = test;
    this.consequent = consequent;
    this.alternate = alternate;
    this.converter = new ExpressionConverter();
  }

  public buildStatement(builtElements) {
    const testCode = this.converter.transformCodeToFunction(this.test);
    const consequentStatement = this.consequent.buildStatement(builtElements);
    const alternateStatement =
      _.has(this, "alternate") && !_.isUndefined(this.alternate)
        ? this.alternate.buildStatement(builtElements)
        : undefined;
    return new IfStatement(testCode, consequentStatement, alternateStatement);
  }

  public getTypes() {
    return _.concat(this.consequent.getTypes(), this.alternate ? this.alternate.getTypes() : []);
  }
}