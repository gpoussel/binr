import {
  BaseAstVisitor,
  BitmaskDeclarationStatement,
  Definition,
  EnumDeclarationStatement,
  EnumReferenceType,
  ForwardStructDeclarationStatement,
  FunctionCallExpression,
  FunctionDeclarationStatement,
  IdentifierValueExpression,
  InlineStructDeclarationStatement,
  NamedType,
  RestrictedType,
  StructDeclarationStatement,
  StructReferenceType,
  Type,
  TypedefStatement,
  UnionDeclarationStatement,
  VoidType,
} from "@binr/ast";
import { each, filter, includes, isUndefined } from "lodash";

import { Format } from "../formats/format";
import { ValidationException } from "./validation-exception";

export class AstValidator extends BaseAstVisitor {
  private _functions: string[] = [];
  private _topLevelFunctions: string[] = [];
  private _enumerations: string[] = [];
  private _structures: string[] = [];
  private _forwardStructures: string[] = [];
  private _definedTypes: string[] = [];
  private _bitmasks: string[] = [];
  private _unions: string[] = [];

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

  visitTypedefStatement(node: TypedefStatement): boolean {
    this._definedTypes.push(node.alias);
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
      each(node.parameters, (parameter) => {
        this.validateTypeExistence(parameter.type);
      });
    }
    return true;
  }

  visitForwardStructDeclarationStatement(node: ForwardStructDeclarationStatement): boolean {
    this._forwardStructures.push(node.name);
    return true;
  }

  visitEnumDeclarationStatement(node: EnumDeclarationStatement): boolean {
    if (includes(this._enumerations, node.name)) {
      throw new ValidationException(`Enumeration ${node.name} is already defined`);
    }
    this._enumerations.push(node.name);
    return true;
  }

  visitInlineStructDeclarationStatement(node: InlineStructDeclarationStatement): boolean {
    if (node.alias) {
      // If inline structures are named, their type can be reused later
      this._structures.push(node.alias);
    }
    return true;
  }

  visitStructDeclarationStatement(node: StructDeclarationStatement): boolean {
    if (includes(this._structures, node.name)) {
      throw new ValidationException(`Structure ${node.name} is already defined`);
    }
    this._structures.push(node.name);
    return true;
  }

  visitUnionDeclarationStatement(node: UnionDeclarationStatement): boolean {
    if (includes(this._unions, node.name)) {
      throw new ValidationException(`Union ${node.name} is already defined`);
    }
    this._unions.push(node.name);
    return true;
  }

  visitBitmaskDeclarationStatement(node: BitmaskDeclarationStatement): boolean {
    if (includes(this._bitmasks, node.name)) {
      throw new ValidationException(`Bitmask ${node.name} is already defined`);
    }
    this._bitmasks.push(node.name);
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
      throw new ValidationException(`Unsupported callable type: ${JSON.stringify(node.callable)}`);
    }
    return true;
  }

  private validateTypeExistence(type: Type) {
    if (type instanceof EnumReferenceType) {
      if (!includes(this._enumerations, type.name)) {
        throw new ValidationException(`Unknown enumeration: ${type.name}`);
      }
    } else if (type instanceof NamedType) {
      if (
        !includes(this._format.builtInTypes, type.name) &&
        !includes(this._definedTypes, type.name) &&
        !includes(this._structures, type.name) &&
        !includes(this._enumerations, type.name) &&
        !includes(this._forwardStructures, type.name) &&
        !includes(this._unions, type.name)
      ) {
        throw new ValidationException(`Unsupported type name: ${type.name}`);
      }
    } else if (type instanceof RestrictedType) {
      this.validateTypeExistence(type.baseType);
    } else if (type instanceof StructReferenceType) {
      if (!includes(this._structures, type.name) && !includes(this._forwardStructures, type.name)) {
        throw new ValidationException(`Unknown structure: ${type.name}`);
      }
    } else if (type instanceof VoidType) {
      // That's fine, nothing to do here
    }
  }
}
