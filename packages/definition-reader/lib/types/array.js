"use strict";

const _ = require("lodash");
const assert = require("assert");

const Type = require("./type");

class ArrayType extends Type {
  constructor(innerType, sizeExpression) {
    super();
    this.innerType = innerType;
    this.sizeExpression = sizeExpression;
  }

  read(buffer, environment) {
    assert(_.isString(this.sizeExpression), "sizeExpression must be a string");
    // TODO: Find a better way of evaluating expressions
    // I think eval() raises some security concerns, but that's fine for now
    // eslint-disable-next-line no-eval
    const size = eval(this.sizeExpression)(environment);
    assert(_.isInteger(size), `evaluated size must be an integer and got: ${size}`);
    assert(size >= 0, `evaluated size must be positive and got ${size}`);
    return _.times(size, () => {
      return this.innerType.read(buffer, environment);
    });
  }
}

module.exports = ArrayType;
