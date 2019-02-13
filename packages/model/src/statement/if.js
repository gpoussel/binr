"use strict";

const _ = require("lodash");

const Statement = require("./statement");

class IfStatement extends Statement {
  constructor(testCode, consequentStatement, alternateStatement) {
    super();
    this.testCode = testCode;
    this.consequentStatement = consequentStatement;
    this.alternateStatement = alternateStatement;
  }

  read(buffer, environment, value) {
    // TODO: Better code evaluation?
    const testResult = eval(this.testCode)(environment);
    if (testResult) {
      this.consequentStatement.read(buffer, environment, value);
    } else if (!_.isUndefined(this.alternateStatement)) {
      this.alternateStatement.read(buffer, environment, value);
    }
  }
}

module.exports = IfStatement;
