"use strict";

const _ = require("lodash");
const { BlockStatement } = require("@binr/model");
const Node = require("./node");

class BlockNode extends Node {
  constructor(innerNodes) {
    super();
    this.innerNodes = innerNodes;
  }

  buildStatement(builtElements) {
    return new BlockStatement(
      _.map(this.innerNodes, innerStatement => innerStatement.buildStatement(builtElements))
    );
  }

  getTypes() {
    return _.flatMap(this.innerNodes, n => n.getTypes());
  }
}

module.exports = BlockNode;
