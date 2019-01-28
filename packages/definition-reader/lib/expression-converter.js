"use strict";

/* eslint-disable no-param-reassign */

const _ = require("lodash");
const esprima = require("esprima");
const escodegen = require("escodegen");
const estraverse = require("estraverse");

class ExpressionConverter {
  convert(source) {
    const ast = esprima.parseScript(source);
    estraverse.replace(ast, {
      enter: node => {
        if (node.generated === true) {
          return estraverse.VisitorOption.Skip;
        }
        if (node.type === esprima.Syntax.MemberExpression) {
          const leftPart = node.object;
          if (leftPart.type === esprima.Syntax.Identifier) {
            node.object = this.generateVariableScopeGetNode(leftPart.name);
          }
        } else if (node.type === esprima.Syntax.ConditionalExpression) {
          if (node.test.type === esprima.Syntax.Identifier) {
            node.test = this.generateVariableScopeGetNode(node.test.name);
          }
          if (node.consequent.type === esprima.Syntax.Identifier) {
            node.consequent = this.generateVariableScopeGetNode(node.consequent.name);
          }
          if (node.alternate.type === esprima.Syntax.Identifier) {
            node.alternate = this.generateVariableScopeGetNode(node.alternate.name);
          }
        } else if (
          node.type === esprima.Syntax.LogicalExpression ||
          node.type === esprima.Syntax.BinaryExpression
        ) {
          if (node.left.type === esprima.Syntax.Identifier) {
            node.left = this.generateVariableScopeGetNode(node.left.name);
          }
          if (node.right.type === esprima.Syntax.Identifier) {
            node.right = this.generateVariableScopeGetNode(node.right.name);
          }
        } else if (node.type === esprima.Syntax.UnaryExpression) {
          if (node.argument.type === esprima.Syntax.Identifier) {
            node.argument = this.generateVariableScopeGetNode(node.argument.name);
          }
        } else if (node.type === esprima.Syntax.CallExpression) {
          if (node.callee.type === esprima.Syntax.Identifier) {
            node.callee = this.generateVariableScopeGetNode(node.callee.name);
          }
          _.times(_.size(node.arguments), i => {
            if (node.arguments[i].type === esprima.Syntax.Identifier) {
              node.arguments[i] = this.generateVariableScopeGetNode(node.arguments[i].name);
            }
          });
        } else if (node.type === esprima.Syntax.ArrayExpression) {
          _.times(_.size(node.elements), i => {
            if (node.elements[i] && node.elements[i].type === esprima.Syntax.Identifier) {
              node.elements[i] = this.generateVariableScopeGetNode(node.elements[i].name);
            }
          });
        } else if (node.type === esprima.Syntax.UpdateExpression) {
          throw new Error("UpdateExpression are not supported");
        }
      },
    });
    const generatedSource = escodegen.generate(ast);
    return generatedSource;
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
