import { BufferWrapper, Environment, ExpressionEvaluator, ValueAggregator } from "@binr/shared";
import { isUndefined } from "lodash";

import { Statement } from "./statement";

export class IfStatement extends Statement {
  private testCode: string;
  private consequentStatement: Statement;
  private alternateStatement: Statement;

  constructor(testCode: string, consequentStatement: Statement, alternateStatement: Statement) {
    super();
    this.testCode = testCode;
    this.consequentStatement = consequentStatement;
    this.alternateStatement = alternateStatement;
  }

  public read(buffer: BufferWrapper, environment: Environment, valueAggregator: ValueAggregator) {
    const evaluator = new ExpressionEvaluator();
    const testResult = evaluator.evaluate(this.testCode, environment);
    if (testResult) {
      this.consequentStatement.read(buffer, environment, valueAggregator);
    } else if (!isUndefined(this.alternateStatement)) {
      this.alternateStatement.read(buffer, environment, valueAggregator);
    }
  }
}
