"use strict";

const _ = require("lodash");
_.mixin(require("lodash-inflection"));

const { builtInTypes } = require("./types");

const typeNames = _.map(builtInTypes, Type => new Type().name);

class DefinitionValidator {
  validate(ast) {
    const errors = [];
    this.validateHeaders(ast.headers, errors);
    this.validateStructures(ast.structures, errors);
    if (!_.isEmpty(errors)) {
      const errorCount = _("error").pluralize(errors.length, true);
      const errorContent = errors.map(s => `\t${s}`).join("\n");
      throw new Error(`Validation error:\n${errorCount} found:\n${errorContent}`);
    }
  }

  validateHeaders(headers, errors) {}

  validateStructures(structures, errors) {
    if (_.isEmpty(structures)) {
      errors.push("No structure defined");
    }

    // First iterate to get all structure names
    // That will help to validate field types
    const structureNames = [];
    _.each(structures, structure => {
      if (_.includes(structureNames, structure.name)) {
        errors.push(`Duplicate structure name '${structure.name}'`);
        return;
      }
      if (_.includes(typeNames, structure.name)) {
        errors.push(`Structure ${structure.name} has invalid name: reserved type`);
        return;
      }
      structureNames.push(structure.name);
    });
    _.each(structures, structure => {
      this.validateStructure(structure, errors, structureNames);
    });
  }

  validateStructure(structure, errors, structureNames) {
    const fieldNames = [];
    _.each(structure.fields, field => {
      if (_.includes(fieldNames, field.name)) {
        errors.push(`Duplicate field name '${field.name}' in structure '${structure.name}'`);
        return;
      }
      fieldNames.push(field.name);

      const builtInType = _.includes(typeNames, field.type);
      const structureType = _.includes(structureNames, field.type);
      if (!builtInType && !structureType) {
        errors.push(`Unknown type '${field.type}' for field '${field.name}`);
      }
    });
  }
}

module.exports = DefinitionValidator;
