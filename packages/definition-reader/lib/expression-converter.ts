import * as escodegen from "escodegen";
import { parseScript, Syntax } from "esprima";
import { includes, isArray, map, size } from "lodash";

export class ExpressionConverter {
  public transformCodeToFunction(code) {
    return `(function() { return ${this.convert(code)}; })()`;
  }

  public convert(source) {
    const ast = parseScript(source);
    if (!isArray(ast.body)) {
      throw new Error("AST body is not an array");
    }
    if (size(ast.body) !== 1) {
      throw new Error("AST body size shall be 1");
    }
    const bodyExpression = ast.body[0];
    if (bodyExpression.type !== Syntax.ExpressionStatement) {
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
    if (expression.type === Syntax.UpdateExpression) {
      throw new Error("UpdateExpression not supported");
    }
    if (expression.type === Syntax.Identifier) {
      return this.generateVariableScopeGetNode(expression.name);
    }
    if (expression.type === Syntax.MemberExpression) {
      expression.object = this.processExpression(expression.object);
    }
    if (expression.type === Syntax.ConditionalExpression) {
      expression.test = this.processExpression(expression.test);
      expression.consequent = this.processExpression(expression.consequent);
      expression.alternate = this.processExpression(expression.alternate);
    }
    if (expression.type === Syntax.LogicalExpression || expression.type === Syntax.BinaryExpression) {
      expression.left = this.processExpression(expression.left);
      expression.right = this.processExpression(expression.right);
    }
    if (expression.type === Syntax.UnaryExpression) {
      expression.argument = this.processExpression(expression.argument);
    }
    if (expression.type === Syntax.CallExpression) {
      const { callee } = expression;
      if (callee.type === Syntax.Identifier) {
        // Top-level functions: that's fine
        const builtInFunction = includes(
          ["abs", "ceil", "cos", "exp", "floor", "log", "max", "min", "pow", "random", "sin", "sqrt", "tan"],
          expression.callee.name,
        );
        expression.callee = builtInFunction
          ? this.generateBuiltinFunctionScopeGetNode(expression.callee.name)
          : this.generateFunctionScopeGetNode(expression.callee.name);
      } else if (callee.type === Syntax.MemberExpression) {
        const { object, property } = callee;
        if (object.type === Syntax.Identifier && object.name === "_" && property.type === Syntax.Identifier) {
          // Function on _ object: that's a global function
          expression.callee = this.generateTopLevelFunctionScopeGetNode(property.name);
        } else {
          throw new Error(`Only top-level functions are supported, received ${callee.type}`);
        }
      } else {
        throw new Error(`Only top-level functions are supported, received ${callee.type}`);
      }
      expression.arguments = map(expression.arguments, (arg) => this.processExpression(arg));
    }
    if (expression.type === Syntax.ArrayExpression) {
      expression.elements = map(expression.elements, (el) => this.processExpression(el));
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
      type: Syntax.MemberExpression,
      generated: true,
      object: {
        type: Syntax.MemberExpression,
        generated: true,
        object: {
          type: Syntax.Identifier,
          name: "env",
        },
        property: {
          type: Syntax.Identifier,
          name: objectName,
        },
      },
      property: {
        type: Syntax.Identifier,
        name: functionName,
      },
    };
  }

  public generateGetNode(objectName, propertyName) {
    return {
      type: Syntax.CallExpression,
      generated: true,
      callee: {
        type: Syntax.MemberExpression,
        generated: true,
        object: {
          type: Syntax.MemberExpression,
          generated: true,
          object: {
            type: Syntax.Identifier,
            name: "env",
          },
          property: {
            type: Syntax.Identifier,
            name: objectName,
          },
        },
        property: {
          type: Syntax.Identifier,
          name: "get",
        },
      },
      arguments: [
        {
          type: Syntax.Literal,
          value: propertyName,
        },
      ],
    };
  }
}
