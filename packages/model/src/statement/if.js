"use strict";

const _ = require("lodash");

const Statement = require("./statement");

class IfStatement extends Statement {
  constructor(testCode, consequentStatement) {
    super();
    this.testCode = testCode;
    this.consequentStatement = consequentStatement;
  }

  read(buffer, parentScope, scope, value) {
    // TODO: Better code evaluation?
    const testResult = eval(this.testCode)(parentScope);
    if (testResult) {
      this.consequentStatement.read(buffer, parentScope, scope, value);
    } else if (!_.isUndefined(this.alternateStatement)) {
      this.alternateStatement.read(buffer, parentScope, scope, value);
    }
  }
}

module.exports = IfStatement;
