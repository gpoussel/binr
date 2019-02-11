"use strict";

const _ = require("lodash");

const Type = require("./type");

class CharArrayType extends Type {
  constructor(arrayType) {
    super();
    this.arrayType = arrayType;
  }

  read(buffer, scopes) {
    return _.join(this.arrayType.read(buffer, scopes), "");
  }
}

module.exports = CharArrayType;
