"use strict";

const _ = require("lodash");
_.mixin(require("lodash-inflection"));

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
    const names = [];
    _.each(structures, structure => {
      if (_.includes(names, structure.name)) {
        errors.push(`Duplicate structure name '${structure.name}'`);
        return;
      }
      names.push(structure.name);

      this.validateStructure(structure, errors);
    });
  }

  validateStructure(structure, errors) {
    const fieldNames = [];
    _.each(structure.fields, field => {
      if (_.includes(fieldNames, field.name)) {
        errors.push(`Duplicate field name '${field.name}' in structure '${structure.name}'`);
        return;
      }
      fieldNames.push(field.name);
    });
  }
}

module.exports = DefinitionValidator;
