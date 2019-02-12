"use strict";

const _ = require("lodash");

const Statement = require("./statement");

class FieldStatement extends Statement {
  constructor(name, type, meta) {
    super();
    this.name = name;
    this.type = type;
    this.meta = meta;
  }

  read(buffer, parentScopes, scopes, value) {
    const readValue = this.type.read(buffer, parentScopes);
    const ignore = _.get(this.meta, "ignore", false);
    if (!ignore) {
      value[this.name] = readValue;
      parentScopes.variables.put(this.name, readValue);
    }
  }
}

module.exports = FieldStatement;
