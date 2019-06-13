"use strict";

const _ = require("lodash");
const Importer = require("../importer");
const { SweetscapeLexer } = require("./sweetscape-lexer");
const SweetscapeParser = require("./sweetscape-parser");
const CStylePreprocessor = require("../common/cstyle-preprocessor");
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
    const preprocessor = new CStylePreprocessor();
    return preprocessor.preprocess(input);
  }

  build(ast) {
    _.each(ast.content, element => console.log(element));
    return ast;
  }
}
module.exports = SweetscapeDefinitionImporter;
