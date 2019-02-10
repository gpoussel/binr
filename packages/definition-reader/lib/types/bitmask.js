"use strict";

const _ = require("lodash");

const Type = require("./type");

class BitmaskType extends Type {
  constructor(parentType, bitmask) {
    super();
    this.parentType = parentType;
    this.bitmask = bitmask;
  }

  read(buffer, scopes) {
    const value = this.parentType.read(buffer, scopes);
    const matchedItems = [];
    _.each(this.bitmask.entries, entry => {
      if ((value & entry.value) !== 0) {
        matchedItems.push(entry.key);
      }
    });
    return matchedItems;
  }
}

module.exports = BitmaskType;
