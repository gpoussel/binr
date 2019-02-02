"use strict";

const assert = require("assert");
const _ = require("lodash");

const Type = require("./type");

class BitmaskType extends Type {
  constructor(bitmask) {
    super();
    assert(!_.isUndefined(bitmask));
    this.bitmask = bitmask;
  }

  read(/* buffer, scope */) {
    // TODO: Read bitmask
    return undefined;
  }
}

module.exports = BitmaskType;
