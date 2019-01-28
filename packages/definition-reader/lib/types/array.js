"use strict";

const _ = require("lodash");
const assert = require("assert");

const { VariableScope } = require("@binr/shared");

const Type = require("./type");

class ArrayType extends Type {
  constructor(innerType, size) {
    super();
    this.innerType = innerType;
    this.size = size;
  }

  read(buffer, scope) {
    let numericSize;
    console.log(this.size);
    if (_.isNumber(this.size)) {
      numericSize = this.size;
    } else if (_.isString(this.size)) {
      numericSize = scope.get(this.size);
      assert(_.isNumber(numericSize), `Array size (${this.size}) is not a number`);
    } else {
      assert(false, `Invalid type for array size:${this.size}`);
      return;
    }
    return _.times(numericSize, () => {
      const nestedScope = new VariableScope(scope);
      return this.innerType.read(buffer, nestedScope);
    });
  }
}

module.exports = ArrayType;
