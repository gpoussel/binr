"use strict";

const _ = require("lodash");

const Statement = require("./statement");

class BlockStatement extends Statement {
  constructor(innerStatements) {
    super();
    this.innerStatements = innerStatements;
  }

  read(buffer, parentScopes, scopes, value) {
    _.each(this.innerStatements, s => s.read(buffer, parentScopes, scopes, value));
  }
}

module.exports = BlockStatement;
