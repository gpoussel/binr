"use strict";

const Definition = require("model/definition");
const Structure = require("model/structure");

class DefinitionBuilder {
  build(ast) {
    const structures = ast.structures.map(s => this.buildStructure(s));

    return new Definition(structures);
  }

  buildStructure(structure) {
    return new Structure(structure.name);
  }
}

module.exports = DefinitionBuilder;
