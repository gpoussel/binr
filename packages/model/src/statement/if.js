"use strict";

const _ = require("lodash");

const { ExpressionEvaluator } = require("@binr/shared");

const Statement = require("./statement");

class IfStatement extends Statement {
  constructor(testCode, consequentStatement, alternateStatement) {
    super();
    this.testCode = testCode;
    this.consequentStatement = consequentStatement;
    this.alternateStatement = alternateStatement;
  }

  read(buffer, environment, valueAggregator) {
    const evaluator = new ExpressionEvaluator();
    const testResult = evaluator.evaluate(this.testCode, environment);
    if (testResult) {
      this.consequentStatement.read(buffer, environment, valueAggregator);
    } else if (!_.isUndefined(this.alternateStatement)) {
      this.alternateStatement.read(buffer, environment, valueAggregator);
    }
  }
}

module.exports = IfStatement;
