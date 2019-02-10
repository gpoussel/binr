/* eslint-disable no-param-reassign */

"use strict";

const assert = require("assert");
const _ = require("lodash");
const { VariableScope } = require("@binr/shared");
const { IfStatement, BlockStatement, FieldStatement } = require("@binr/model");

const Type = require("./type");

class StructureType extends Type {
  constructor(structure) {
    super();
    assert(!_.isUndefined(structure));
    this.structure = structure;
  }

  read(buffer, scope) {
    const value = {};
    _.each(this.structure.fields, statement => {
      buffer.setEndianness(this.structure.endianness);
      const nestedScope = new VariableScope(scope);
      this.readStatement(statement, buffer, nestedScope, value, scope);
    });
    return value;
  }

  readStatement(statement, buffer, nestedScope, value, scope) {
    if (statement instanceof FieldStatement) {
      const readValue = statement.type.read(buffer, nestedScope);
      const ignore = _.get(statement.meta, "ignore", false);
      if (!ignore) {
        value[statement.name] = readValue;
        scope.put(statement.name, readValue);
      }
    } else if (statement instanceof IfStatement) {
      // TODO: Better code evaluation?
      // eslint-disable-next-line no-eval
      const testResult = eval(statement.testCode)(nestedScope);
      if (testResult) {
        this.readStatement(statement.consequentStatement, buffer, nestedScope, value, scope);
      } else if (_.has(statement, "alternateStatement")) {
        this.readStatement(statement.alternateStatement, buffer, nestedScope, value, scope);
      }
    } else if (statement instanceof BlockStatement) {
      _.each(statement.innerStatements, s => this.readStatement(s, buffer, nestedScope, value, scope));
    }
  }
}

module.exports = StructureType;
