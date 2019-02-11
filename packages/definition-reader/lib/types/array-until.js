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

  read(buffer, scopes) {
    assert(_.isString(this.untilExpression), "untilExpression must be a string");
    const untilFn = eval(this.untilExpression);
    const values = [];

    let { element, elementScopes } = this.readSingleElement(buffer, scopes);
    values.push(element);

    while (!untilFn(elementScopes)) {
      ({ element, elementScopes } = this.readSingleElement(buffer, scopes));
      values.push(element);
    }
    return values;
  }

  readSingleElement(buffer, scopes) {
    const nestedScope = {
      functions: scopes.functions,
      stream: scopes.stream,
      variables: new VariableScope(scopes.variables),
    };
    return {
      element: this.innerType.read(buffer, nestedScope),
      elementScopes: nestedScope,
    };
  }
}

module.exports = ArrayUntilType;
