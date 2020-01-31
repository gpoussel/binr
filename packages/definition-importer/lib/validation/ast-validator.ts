import {
  BaseAstVisitor,
  BitmaskDeclarationStatement,
  Definition,
  EnumDeclarationStatement,
  FunctionCallExpression,
  FunctionDeclarationStatement,
  IdentifierValueExpression,
  StructDeclarationStatement,
} from "@binr/ast";
import { each, filter, includes, isUndefined } from "lodash";

import { Format } from "../formats/format";
import { ValidationException } from "./validation-exception";

export class AstValidator extends BaseAstVisitor {
  private _functions: string[] = [];
  private _topLevelFunctions: string[] = [];
  private _enumerations: string[] = [];
  private _structures: string[] = [];
  private _bitmasks: string[] = [];

  public constructor(private _format: Format) {
    super();
  }

  visitDefinition(node: Definition): boolean {
    each(
      filter(node.statements, (s) => s instanceof FunctionDeclarationStatement),
      (declaration) => {
        this._topLevelFunctions.push((declaration as FunctionDeclarationStatement).name);
      },
    );
    return true;
  }

  visitFunctionDeclarationStatement(node: FunctionDeclarationStatement): boolean {
    const forwardDeclaration = isUndefined(node.body);
    if (includes(this._functions, node.name)) {
      throw new ValidationException(`Function ${node.name} is already defined`);
    }
    if (includes(this._format.builtInFunctions, node.name)) {
      throw new ValidationException(`Cannot redefine built-in function ${node.name}`);
    }
    if (!forwardDeclaration) {
      this._functions.push(node.name);
    }
    return true;
  }

  visitEnumDeclarationStatement(node: EnumDeclarationStatement): boolean {
    if (includes(this._enumerations, node.name)) {
      throw new ValidationException(`Enumeration ${node.name} is already defined`);
    }
    this._enumerations.push(node.name);
    return true;
  }

  visitStructDeclarationStatement(node: StructDeclarationStatement): boolean {
    const anonymous = isUndefined(node.name);
    if (!anonymous) {
      if (includes(this._structures, node.name)) {
        throw new ValidationException(`Structure ${node.name} is already defined`);
      }
      this._structures.push(node.name as string);
    }
    return true;
  }

  visitBitmaskDeclarationStatement(node: BitmaskDeclarationStatement): boolean {
    if (includes(this._bitmasks, node.name)) {
      throw new ValidationException(`Bitmask ${node.name} is already defined`);
    }
    this._bitmasks.push(node.name as string);
    return true;
  }

  visitFunctionCallExpression(node: FunctionCallExpression): boolean {
    if (node.callable instanceof IdentifierValueExpression) {
      const name = (node.callable as IdentifierValueExpression).name;
      if (
        !includes(this._functions, name) &&
        !includes(this._topLevelFunctions, name) &&
        !includes(this._format.builtInFunctions, name)
      ) {
        throw new ValidationException(`Function ${name} does not exist`);
      }
    } else {
      console.log(node.callable);
    }
    return true;
  }
}
