import { each, has, includes, isEmpty, map, union } from "lodash";
import * as pluralize from "pluralize";

import { FieldNode } from "./nodes";
import { builtInTypes } from "./types";

export class DefinitionValidator {
  public validate(ast) {
    const errors = [];
    this.validateHeaders(ast.headers, errors);
    const enumerationNames = map(ast.enumerations, "name");
    const bitmaskNames = map(ast.bitmasks, "name");
    this.validateStructures(ast.structures, union(enumerationNames, bitmaskNames), errors);
    if (!isEmpty(errors)) {
      const errorCount = pluralize("error", errors.length, true);
      const errorContent = errors.map((s) => `\t${s}`).join("\n");
      throw new Error(`Validation error:\n${errorCount} found:\n${errorContent}`);
    }
  }

  public validateHeaders(headers, errors) {
    const headerNames: string[] = [];
    each(headers, (h) => {
      if (includes(headerNames, h.name)) {
        errors.push(`Header ${h.name} is defined twice.`);
        return;
      }
      headerNames.push(h.name);
    });
  }

  public validateStructures(structures, definedNames, errors) {
    if (isEmpty(structures)) {
      errors.push("No structure defined");
    }

    // First iterate to get all structure names
    // That will help to validate field types
    const structureNames: string[] = [];
    each(structures, (structure) => {
      if (includes(structureNames, structure.name)) {
        errors.push(`Duplicate structure name '${structure.name}'`);
        return;
      }
      if (includes(definedNames, structure.name)) {
        errors.push(`Structure name '${structure.name}' is already defined`);
        return;
      }
      if (has(builtInTypes, structure.name)) {
        errors.push(`Structure ${structure.name} has invalid name: reserved type`);
        return;
      }
      structureNames.push(structure.name);
    });
    const typeNames = union(structureNames, definedNames);
    each(structures, (structure) => {
      this.validateStructure(structure, errors, typeNames);
    });
  }

  public validateStructure(structure, errors, typeNames) {
    const fieldNames: string[] = [];
    each(structure.statements, (statement) => {
      if (!(statement instanceof FieldNode)) {
        // FIXME: Ignore non-fields for the validation step.
        // This not-implemented validation slows down development of new
        // features. It shall be postponed later.
        return;
      }
      if (includes(fieldNames, statement.name)) {
        errors.push(`Duplicate field name '${statement.name}' in structure '${structure.name}'`);
        return;
      }
      fieldNames.push(statement.name);

      this.validateField(statement, errors, typeNames);
    });
  }

  public validateField(field, errors, typeNames) {
    const { type } = field;
    const builtInType = has(builtInTypes, type.type);
    const definedType = includes(typeNames, type.type);
    if (!builtInType && !definedType) {
      errors.push(`Unknown type '${type.type}' for field '${field.name}'`);
    }

    const hasTypeRestriction = has(type, "typeRestriction");
    if (hasTypeRestriction) {
      if (type.typeRestriction <= 0 || type.typeRestriction > 64) {
        errors.push(`Field ${field.name} size must be between 0 and 64`);
      }
    }

    const fieldsWithoutTypeRestriction = ["string", "char"];
    if (includes(fieldsWithoutTypeRestriction, type.type) && hasTypeRestriction) {
      errors.push(`Field ${field.name} (type: ${type.type}) must not have type restriction`);
    }
  }
}
