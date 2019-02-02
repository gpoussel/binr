"use strict";

/* eslint-disable no-param-reassign */

const _ = require("lodash");
const esprima = require("esprima");
const escodegen = require("escodegen");
const estraverse = require("estraverse");

class ExpressionConverter {
  convert(source) {
    const ast = esprima.parseScript(source);
    if (!_.isArray(ast.body)) {
      throw new Error(`AST body is not an array`);
    }
    if (_.size(ast.body) !== 1) {
      throw new Error(`AST body size shall be 1`);
    }
    const bodyExpression = ast.body[0];
    if (bodyExpression.type !== esprima.Syntax.ExpressionStatement) {
      throw new Error(`body shall be an expression`);
    }
    this.processExpression(bodyExpression);
    const generatedSource = escodegen.generate(ast);
    return generatedSource;
  }

  processExpression(expression) {
    if (expression.expression.type === esprima.Syntax.Identifier) {
      expression.expression = this.generateVariableScopeGetNode(expression.expression.name);
    } else if (expression.expression.type === esprima.Syntax.UpdateExpression) {
      throw new Error(`UpdateExpression not supported`);
    }
  }

  generateVariableScopeGetNode(name) {
    return this.generateGetNode("variableScope", name);
  }

  generateGetNode(objectName, propertyName) {
    return {
      type: esprima.Syntax.CallExpression,
      callee: {
        type: esprima.Syntax.MemberExpression,
        generated: true,
        object: {
          type: esprima.Syntax.Identifier,
          name: objectName,
        },
        property: {
          type: esprima.Syntax.Identifier,
          name: "get",
        },
      },
      arguments: [
        {
          type: esprima.Syntax.Literal,
          value: propertyName,
        },
      ],
    };
  }
}

module.exports = ExpressionConverter;
