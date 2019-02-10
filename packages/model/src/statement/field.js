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

  read(buffer, parentScope, scope, value) {
    const readValue = this.type.read(buffer, parentScope);
    const ignore = _.get(this.meta, "ignore", false);
    if (!ignore) {
      value[this.name] = readValue;
      scope.put(this.name, readValue);
    }
  }
}

module.exports = FieldStatement;
