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
    _.each(
      _.map(_.filter(ast.content, element => _.get(element, "type") === "ifStatement"), element => element),
      expression => {
        console.log(expression);
      }
    );
    return ast;
  }
}
module.exports = SweetscapeDefinitionImporter;
