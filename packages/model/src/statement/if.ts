import _ from "lodash";

import { ExpressionEvaluator } from "@binr/shared";

import { Statement } from "./statement";

export class IfStatement extends Statement {
  private testCode: string;
  private consequentStatement: any;
  private alternateStatement: any;

  constructor(testCode, consequentStatement, alternateStatement) {
    super();
    this.testCode = testCode;
    this.consequentStatement = consequentStatement;
    this.alternateStatement = alternateStatement;
  }

  public read(buffer, environment, valueAggregator) {
    const evaluator = new ExpressionEvaluator();
    const testResult = evaluator.evaluate(this.testCode, environment);
    if (testResult) {
      this.consequentStatement.read(buffer, environment, valueAggregator);
    } else if (!_.isUndefined(this.alternateStatement)) {
      this.alternateStatement.read(buffer, environment, valueAggregator);
    }
  }
}
