import * as assert from "assert";
import { isInteger, isString, times } from "lodash";

import { ExpressionEvaluator } from "@binr/shared";

import { Type } from "./type";

export class ArrayType extends Type {
  private innerType: any;
  private sizeExpression: any;
  constructor(innerType, sizeExpression) {
    super();
    this.innerType = innerType;
    this.sizeExpression = sizeExpression;
  }

  public read(buffer, environment) {
    const evaluator = new ExpressionEvaluator();
    assert(isString(this.sizeExpression), "sizeExpression must be a string");
    const size = evaluator.evaluate(this.sizeExpression, environment);
    assert(isInteger(size), `evaluated size must be an integer and got: ${size}`);
    assert(size >= 0, `evaluated size must be positive and got ${size}`);
    return times(size, () => {
      return this.innerType.read(buffer, environment);
    });
  }
}
