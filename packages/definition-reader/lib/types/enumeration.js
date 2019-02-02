"use strict";

const assert = require("assert");
const _ = require("lodash");
const { VariableScope } = require("@binr/shared");

const Type = require("./type");

class EnumerationType extends Type {
  constructor(enumeration) {
    super();
    assert(!_.isUndefined(enumeration));
    this.enumeration = enumeration;
  }

  read(buffer, scope) {
    // TODO: Read enumeration
    return undefined;
  }
}

module.exports = EnumerationType;
