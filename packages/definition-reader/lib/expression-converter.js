"use strict";

/* eslint-disable no-param-reassign */

const _ = require("lodash");
const esprima = require("esprima");
const escodegen = require("escodegen");

class ExpressionConverter {
  transformCodeToFunction(code) {
    return `(function(scopes) { "use strict"; return ${this.convert(code)} })`;
  }

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
      return this.generateVariableScopeGetNode(expression.name);
    }
    if (expression.type === esprima.Syntax.MemberExpression) {
      expression.object = this.processExpression(expression.object);
    }
    if (expression.type === esprima.Syntax.ConditionalExpression) {
      expression.test = this.processExpression(expression.test);
      expression.consequent = this.processExpression(expression.consequent);
      expression.alternate = this.processExpression(expression.alternate);
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
      const { callee } = expression;
      if (callee.type === esprima.Syntax.Identifier) {
        // Top-level functions: that's fine
        expression.callee = this.generateFunctionScopeGetNode(expression.callee.name);
      } else if (callee.type === esprima.Syntax.MemberExpression) {
        const { object, property } = callee;
        if (
          object.type === esprima.Syntax.Identifier &&
          object.name === "_" &&
          property.type === esprima.Syntax.Identifier
        ) {
          // Function on _ object: that's a global function
          expression.callee = this.generateTopLevelFunctionScopeGetNode(property.name);
        } else {
          throw new Error(`Only top-level functions are supported, received ${callee.type}`);
        }
      } else {
        throw new Error(`Only top-level functions are supported, received ${callee.type}`);
      }
      expression.arguments = _.map(expression.arguments, arg => this.processExpression(arg));
    }
    if (expression.type === esprima.Syntax.ArrayExpression) {
      expression.elements = _.map(expression.elements, el => this.processExpression(el));
    }
    return expression;
  }

  generateVariableScopeGetNode(name) {
    return this.generateGetNode("variables", name);
  }

  generateFunctionScopeGetNode(name) {
    return this.generateGetNode("functions", name);
  }

  generateTopLevelFunctionScopeGetNode(name) {
    return {
      type: esprima.Syntax.MemberExpression,
      generated: true,
      object: {
        type: esprima.Syntax.MemberExpression,
        generated: true,
        object: {
          type: esprima.Syntax.Identifier,
          name: "scopes",
        },
        property: {
          type: esprima.Syntax.Identifier,
          name: "stream",
        },
      },
      property: {
        type: esprima.Syntax.Identifier,
        name,
      },
    };
  }

  generateGetNode(objectName, propertyName) {
    return {
      type: esprima.Syntax.CallExpression,
      generated: true,
      callee: {
        type: esprima.Syntax.MemberExpression,
        generated: true,
        object: {
          type: esprima.Syntax.MemberExpression,
          generated: true,
          object: {
            type: esprima.Syntax.Identifier,
            name: "scopes",
          },
          property: {
            type: esprima.Syntax.Identifier,
            name: objectName,
          },
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
