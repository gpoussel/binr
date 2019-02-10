"use strict";

const _ = require("lodash");
const assert = require("assert");

const { VariableScope } = require("@binr/shared");

const Type = require("./type");

class ArrayUntilType extends Type {
  constructor(innerType, untilExpression) {
    super();
    this.innerType = innerType;
    this.untilExpression = untilExpression;
  }

  read(buffer, scope) {
    assert(_.isString(this.untilExpression), "untilExpression must be a string");
    const untilFn = eval(this.untilExpression);
    const values = [];

    let { element, elementScope } = this.readSingleElement(buffer, scope);
    values.push(element);

    while (!untilFn(elementScope)) {
      ({ element, elementScope } = this.readSingleElement(buffer, scope));
      values.push(element);
    }
    return values;
  }

  readSingleElement(buffer, scope) {
    const nestedScope = new VariableScope(scope);
    return {
      element: this.innerType.read(buffer, nestedScope),
      elementScope: nestedScope,
    };
  }
}

module.exports = ArrayUntilType;
