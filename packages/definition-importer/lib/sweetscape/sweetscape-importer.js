"use strict";

const Importer = require("../importer");
const { SweetscapeLexer } = require("./sweetscape-lexer");
const SweetscapeParser = require("./sweetscape-parser");
const { getVisitor } = require("./sweetscape-visitor");

class SweetscapeDefinitionImporter extends Importer {
  getLexer() {
    return new SweetscapeLexer();
  }

  getParser() {
    return new SweetscapeParser();
  }

  getVisitor(parser) {
    return getVisitor(parser);
  }

  performPreprocessing(input) {
    // TODO Execute #define, #ifdef, #else and #endif
    return input.replace(/^\w*#.*/gm, "");
  }

  build(ast) {
    // TODO: Complete that!
    return {};
  }
}
module.exports = SweetscapeDefinitionImporter;
