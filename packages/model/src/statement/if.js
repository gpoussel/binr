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

  read(buffer, parentScopes, scopes, value) {
    // TODO: Better code evaluation?
    const testResult = eval(this.testCode)(parentScopes);
    if (testResult) {
      this.consequentStatement.read(buffer, parentScopes, scopes, value);
    } else if (!_.isUndefined(this.alternateStatement)) {
      this.alternateStatement.read(buffer, parentScopes, scopes, value);
    }
  }
}

module.exports = IfStatement;
