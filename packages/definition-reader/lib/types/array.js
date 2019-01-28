"use strict";

const _ = require("lodash");
const assert = require("assert");

const { VariableScope } = require("@binr/shared");

const Type = require("./type");

class ArrayType extends Type {
  constructor(innerType, sizeExpression) {
    super();
    this.innerType = innerType;
    this.sizeExpression = sizeExpression;
  }

  read(buffer, scope) {
    assert(_.isString(this.sizeExpression), "sizeExpression must be a string");
    // TODO: Find a better way of evaluating expressions
    // I think eval() raises some security concerns, but that's fine for now
    // eslint-disable-next-line no-eval
    const size = eval(this.sizeExpression)(scope);
    assert(_.isInteger(size), "evaluated size must be an integer");
    assert(size >= 0, "evaluated size must be positive");
    return _.times(size, () => {
      const nestedScope = new VariableScope(scope);
      return this.innerType.read(buffer, nestedScope);
    });
  }
}

module.exports = ArrayType;
