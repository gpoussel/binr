"use strict";

const _ = require("lodash");
const assert = require("assert");

const { ExpressionEvaluator } = require("@binr/shared");

const Type = require("./type");

class ArrayUntilType extends Type {
  constructor(innerType, untilExpression) {
    super();
    this.innerType = innerType;
    this.untilExpression = untilExpression;
  }

  read(buffer, environment) {
    const evaluator = new ExpressionEvaluator();
    assert(_.isString(this.untilExpression), "untilExpression must be a string");
    const values = [];

    let { element, nestedEnvironment } = this.readSingleElement(buffer, environment);
    values.push(element);

    while (!evaluator.evaluate(this.untilExpression, nestedEnvironment)) {
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
