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
    bodyExpression.expression = this.processExpression(bodyExpression.expression);
    const generatedSource = escodegen.generate(ast);
    return generatedSource;
  }

  processExpression(expression) {
    if (!expression || expression.generated) {
      return expression;
    }
    if (expression.type === esprima.Syntax.UpdateExpression) {
      throw new Error(`UpdateExpression not supported`);
    }
    if (expression.type === esprima.Syntax.Identifier) {
      const generatedNode = this.generateVariableScopeGetNode(expression.name);
      generatedNode.generated = true;
      return generatedNode;
    }
    if (expression.type === esprima.Syntax.MemberExpression) {
      expression.object = this.processExpression(expression.object);
    }
    if (expression.type === esprima.Syntax.ConditionalExpression) {
      expression.test = this.processExpression(expression.test);
      expression.consequent = this.processExpression(expression.consequent);
      expression.alternate = this.processExpression(expression.test);
    }
    if (
      expression.type === esprima.Syntax.LogicalExpression ||
      expression.type === esprima.Syntax.BinaryExpression
    ) {
      expression.left = this.processExpression(expression.left);
      expression.right = this.processExpression(expression.right);
    }
    if (expression.type === esprima.Syntax.UnaryExpression) {
      expression.argument = this.processExpression(expression.argument);
    }
    if (expression.type === esprima.Syntax.CallExpression) {
      expression.callee = this.processExpression(expression.callee);
      expression.arguments = _.map(expression.arguments, this.processExpression.bind(this));
    }
    if (expression.type === esprima.Syntax.ArrayExpression) {
      expression.elements = _.map(expression.elements, this.processExpression.bind(this));
    }
    return expression;
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
