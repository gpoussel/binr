"use strict";

const Importer = require("../importer");
const SweetscapeLexer = require("./sweetscape-lexer");
const SweetscapeParser = require("./sweetscape-parser");
const CStylePreprocessor = require("../common/cstyle-preprocessor");
const { getVisitor } = require("./sweetscape-visitor");

export class SweetscapeDefinitionImporter extends Importer {
  public getLexer() {
    return new SweetscapeLexer();
  }

  public getParser() {
    return new SweetscapeParser();
  }

  public getVisitor(parser) {
    return getVisitor(parser);
  }

  public performPreprocessing(input) {
    const preprocessor = new CStylePreprocessor();
    return preprocessor.preprocess(input);
  }

  public build(ast) {
    return ast;
  }
}
