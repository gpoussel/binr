import * as assert from "assert";
import { isString } from "lodash";

import { ExpressionEvaluator } from "@binr/shared";

import { Type } from "./type";

export class ArrayUntilType extends Type {
  private innerType: any;
  private untilExpression: any;
  constructor(innerType, untilExpression) {
    super();
    this.innerType = innerType;
    this.untilExpression = untilExpression;
  }

  public read(buffer, environment) {
    const evaluator = new ExpressionEvaluator();
    assert(isString(this.untilExpression), "untilExpression must be a string");
    const values: any[] = [];

    let { element, nestedEnvironment } = this.readSingleElement(buffer, environment);
    values.push(element);

    while (!evaluator.evaluate(this.untilExpression, nestedEnvironment)) {
      ({ element, nestedEnvironment } = this.readSingleElement(buffer, environment));
      values.push(element);
    }
    return values;
  }

  public readSingleElement(buffer, environment) {
    return {
      element: this.innerType.read(buffer, environment),
      nestedEnvironment: environment,
    };
  }
}
