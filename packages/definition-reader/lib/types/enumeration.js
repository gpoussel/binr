"use strict";

const _ = require("lodash");

const Type = require("./type");

class EnumerationType extends Type {
  constructor(parentType, enumeration) {
    super();
    this.parentType = parentType;
    this.enumeration = enumeration;
  }

  read(buffer, scopes) {
    const value = this.parentType.read(buffer, scopes);
    const matchingEntry = _.find(this.enumeration.entries, entry => entry.value === value);
    return _.get(matchingEntry, "key");
  }
}

module.exports = EnumerationType;
