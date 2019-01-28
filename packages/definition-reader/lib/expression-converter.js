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
        if (node.type === "MemberExpression") {
          const leftPart = node.object;
          if (leftPart.type === "Identifier") {
            node.object = this.generateVariableScopeGetNode(leftPart.name);
          }
        } else if (node.type === "ConditionalExpression") {
          if (node.test.type === "Identifier") {
            node.test = this.generateVariableScopeGetNode(node.test.name);
          }
          if (node.consequent.type === "Identifier") {
            node.consequent = this.generateVariableScopeGetNode(node.consequent.name);
          }
          if (node.alternate.type === "Identifier") {
            node.alternate = this.generateVariableScopeGetNode(node.alternate.name);
          }
        } else if (node.type === "LogicalExpression" || node.type === "BinaryExpression") {
          if (node.left.type === "Identifier") {
            node.left = this.generateVariableScopeGetNode(node.left.name);
          }
          if (node.right.type === "Identifier") {
            node.right = this.generateVariableScopeGetNode(node.right.name);
          }
        } else if (node.type === "UnaryExpression") {
          if (node.argument.type === "Identifier") {
            node.argument = this.generateVariableScopeGetNode(node.argument.name);
          }
        } else if (node.type === "CallExpression") {
          if (node.callee.type === "Identifier") {
            node.callee = this.generateVariableScopeGetNode(node.callee.name);
          }
          _.times(_.size(node.arguments), i => {
            if (node.arguments[i].type === "Identifier") {
              node.arguments[i] = this.generateVariableScopeGetNode(node.arguments[i].name);
            }
          });
        } else if (node.type === "ArrayExpression") {
          _.times(_.size(node.elements), i => {
            if (node.elements[i] && node.elements[i].type === "Identifier") {
              node.elements[i] = this.generateVariableScopeGetNode(node.elements[i].name);
            }
          });
        } else if (node.type === "UpdateExpression") {
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
      type: "CallExpression",
      callee: {
        type: "MemberExpression",
        generated: true,
        object: {
          type: "Identifier",
          name: objectName,
        },
        property: {
          type: "Identifier",
          name: "get",
        },
      },
      arguments: [
        {
          type: "Literal",
          value: propertyName,
        },
      ],
    };
  }
}

module.exports = ExpressionConverter;
