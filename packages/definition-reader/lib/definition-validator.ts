import _ from "lodash";
import lodashInflection from "lodash-inflection";
_.mixin(lodashInflection);

import { FieldNode } from "./nodes";
import { builtInTypes } from "./types";

export class DefinitionValidator {
  public validate(ast) {
    const errors = [];
    this.validateHeaders(ast.headers, errors);
    const enumerationNames = _.map(ast.enumerations, "name");
    const bitmaskNames = _.map(ast.bitmasks, "name");
    this.validateStructures(ast.structures, _.union(enumerationNames, bitmaskNames), errors);
    if (!_.isEmpty(errors)) {
      const errorCount = _("error").pluralize(errors.length, true);
      const errorContent = errors.map((s) => `\t${s}`).join("\n");
      throw new Error(`Validation error:\n${errorCount} found:\n${errorContent}`);
    }
  }

  public validateHeaders(headers, errors) {
    const headerNames = [];
    _.each(headers, (h) => {
      if (_.includes(headerNames, h.name)) {
        errors.push(`Header ${h.name} is defined twice.`);
        return;
      }
      headerNames.push(h.name);
    });
  }

  public validateStructures(structures, definedNames, errors) {
    if (_.isEmpty(structures)) {
      errors.push("No structure defined");
    }

    // First iterate to get all structure names
    // That will help to validate field types
    const structureNames = [];
    _.each(structures, (structure) => {
      if (_.includes(structureNames, structure.name)) {
        errors.push(`Duplicate structure name '${structure.name}'`);
        return;
      }
      if (_.includes(definedNames, structure.name)) {
        errors.push(`Structure name '${structure.name}' is already defined`);
        return;
      }
      if (_.has(builtInTypes, structure.name)) {
        errors.push(`Structure ${structure.name} has invalid name: reserved type`);
        return;
      }
      structureNames.push(structure.name);
    });
    const typeNames = _.union(structureNames, definedNames);
    _.each(structures, (structure) => {
      this.validateStructure(structure, errors, typeNames);
    });
  }

  public validateStructure(structure, errors, typeNames) {
    const fieldNames = [];
    _.each(structure.statements, (statement) => {
      if (!(statement instanceof FieldNode)) {
        // FIXME: Ignore non-fields for the validation step.
        // This not-implemented validation slows down development of new
        // features. It shall be postponed later.
        return;
      }
      if (_.includes(fieldNames, statement.name)) {
        errors.push(`Duplicate field name '${statement.name}' in structure '${structure.name}'`);
        return;
      }
      fieldNames.push(statement.name);

      this.validateField(statement, errors, typeNames);
    });
  }

  public validateField(field, errors, typeNames) {
    const { type } = field;
    const builtInType = _.has(builtInTypes, type.type);
    const definedType = _.includes(typeNames, type.type);
    if (!builtInType && !definedType) {
      errors.push(`Unknown type '${type.type}' for field '${field.name}'`);
    }

    const hasTypeRestriction = _.has(type, "typeRestriction");
    if (hasTypeRestriction) {
      if (type.typeRestriction <= 0 || type.typeRestriction > 64) {
        errors.push(`Field ${field.name} size must be between 0 and 64`);
      }
    }

    const fieldsWithoutTypeRestriction = ["string", "char"];
    if (_.includes(fieldsWithoutTypeRestriction, type.type) && hasTypeRestriction) {
      errors.push(`Field ${field.name} (type: ${type.type}) must not have type restriction`);
    }
  }
}
