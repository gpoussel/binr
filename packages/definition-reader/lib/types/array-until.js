"use strict";

const _ = require("lodash");
const assert = require("assert");

const Type = require("./type");

class ArrayUntilType extends Type {
  constructor(innerType, untilExpression) {
    super();
    this.innerType = innerType;
    this.untilExpression = untilExpression;
  }

  read(buffer, environment) {
    assert(_.isString(this.untilExpression), "untilExpression must be a string");
    const untilFn = eval(this.untilExpression);
    const values = [];

    let { element, nestedEnvironment } = this.readSingleElement(buffer, environment);
    values.push(element);

    while (!untilFn(nestedEnvironment)) {
      ({ element, nestedEnvironment } = this.readSingleElement(buffer, environment));
      values.push(element);
    }
    return values;
  }

  readSingleElement(buffer, environment) {
    return {
      element: this.innerType.read(buffer, environment),
      nestedEnvironment: environment,
    };
  }
}

module.exports = ArrayUntilType;
