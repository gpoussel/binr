"use strict";

/* eslint-disable no-param-reassign */

import escodegen from "escodegen";
import esprima from "esprima";
import _ from "lodash";

export class ExpressionConverter {
  public transformCodeToFunction(code) {
    return `(function() { return ${this.convert(code)}; })()`;
  }

  public convert(source) {
    const ast = esprima.parseScript(source);
    if (!_.isArray(ast.body)) {
      throw new Error("AST body is not an array");
    }
    if (_.size(ast.body) !== 1) {
      throw new Error("AST body size shall be 1");
    }
    const bodyExpression = ast.body[0];
    if (bodyExpression.type !== esprima.Syntax.ExpressionStatement) {
      throw new Error("body shall be an expression");
    }
    bodyExpression.expression = this.processExpression(bodyExpression.expression);
    const generatedSource = escodegen.generate(ast);
    return generatedSource;
  }

  public processExpression(expression) {
    if (!expression || expression.generated) {
      return expression;
    }
    if (expression.type === esprima.Syntax.UpdateExpression) {
      throw new Error("UpdateExpression not supported");
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
        if (
          _.includes(
            [
              "abs",
              "ceil",
              "cos",
              "exp",
              "floor",
              "log",
              "max",
              "min",
              "pow",
              "random",
              "sin",
              "sqrt",
              "tan",
            ],
            expression.callee.name,
          )
        ) {
          expression.callee = this.generateBuiltinFunctionScopeGetNode(expression.callee.name);
        } else {
          expression.callee = this.generateFunctionScopeGetNode(expression.callee.name);
        }
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
      expression.arguments = _.map(expression.arguments, (arg) => this.processExpression(arg));
    }
    if (expression.type === esprima.Syntax.ArrayExpression) {
      expression.elements = _.map(expression.elements, (el) => this.processExpression(el));
    }
    return expression;
  }

  public generateVariableScopeGetNode(name) {
    return this.generateGetNode("variables", name);
  }

  public generateFunctionScopeGetNode(name) {
    return this.generateGetNode("functions", name);
  }

  public generateTopLevelFunctionScopeGetNode(name) {
    return this.generateFunctionCallNode("stream", name);
  }

  public generateBuiltinFunctionScopeGetNode(name) {
    return this.generateFunctionCallNode("utils", name);
  }

  public generateFunctionCallNode(objectName, functionName) {
    return {
      type: esprima.Syntax.MemberExpression,
      generated: true,
      object: {
        type: esprima.Syntax.MemberExpression,
        generated: true,
        object: {
          type: esprima.Syntax.Identifier,
          name: "env",
        },
        property: {
          type: esprima.Syntax.Identifier,
          name: objectName,
        },
      },
      property: {
        type: esprima.Syntax.Identifier,
        name: functionName,
      },
    };
  }

  public generateGetNode(objectName, propertyName) {
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
            name: "env",
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
