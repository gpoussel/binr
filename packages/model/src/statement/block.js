"use strict";

const _ = require("lodash");

const Statement = require("./statement");

class BlockStatement extends Statement {
  constructor(innerStatements) {
    super();
    this.innerStatements = innerStatements;
  }

  read(buffer, environment, valueAggregator) {
    _.each(this.innerStatements, s => s.read(buffer, environment, valueAggregator));
  }
}

module.exports = BlockStatement;
