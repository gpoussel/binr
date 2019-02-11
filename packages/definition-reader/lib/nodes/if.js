"use strict";

const _ = require("lodash");
const { IfStatement } = require("@binr/model");
const ExpressionConverter = require("../expression-converter");
const Node = require("./node");

class IfNode extends Node {
  constructor(test, consequent, alternate) {
    super();
    this.test = test;
    this.consequent = consequent;
    this.alternate = alternate;
    this.converter = new ExpressionConverter();
  }

  buildStatement(builtElements) {
    const testCode = this.converter.transformCodeToFunction(this.test);
    const consequentStatement = this.consequent.buildStatement(builtElements);
    const alternateStatement =
      _.has(this, "alternate") && !_.isUndefined(this.alternate)
        ? this.alternate.buildStatement(builtElements)
        : undefined;
    return new IfStatement(testCode, consequentStatement, alternateStatement);
  }

  getTypes() {
    return _.concat(this.consequent.getTypes(), this.alternate ? this.alternate.getTypes() : []);
  }
}

module.exports = IfNode;
