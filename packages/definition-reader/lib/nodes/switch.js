"use strict";

const _ = require("lodash");
const { BlockStatement, IfStatement } = require("@binr/model");
const ExpressionConverter = require("../expression-converter");
const Node = require("./node");

class SwitchNode extends Node {
  constructor(test, clauses) {
    super();
    this.test = test;
    this.clauses = clauses;
    this.converter = new ExpressionConverter();
  }

  buildStatement(builtElements) {
    if (_.isEmpty(this.clauses)) {
      // That's an empty switch, so convert it to a block statement without content
      return new BlockStatement([]);
    }
    let currentStatement;
    _.forEachRight(this.clauses, clause => {
      const statement = clause.statement.buildStatement(builtElements);
      const testCondition = this.getTestCondition(clause.value);
      currentStatement = new IfStatement(testCondition, statement, currentStatement);
    });
    return currentStatement;
  }

  getTypes() {
    return _.flatMap(this.clauses, clause => clause.statement.getTypes());
  }

  getTestCondition(value) {
    return this.converter.transformCodeToFunction(`${this.test} === ${value}`);
  }
}

module.exports = SwitchNode;
