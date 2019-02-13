"use strict";

const _ = require("lodash");

const Statement = require("./statement");

class BlockStatement extends Statement {
  constructor(innerStatements) {
    super();
    this.innerStatements = innerStatements;
  }

  read(buffer, environment, value) {
    _.each(this.innerStatements, s => s.read(buffer, environment, value));
  }
}

module.exports = BlockStatement;
