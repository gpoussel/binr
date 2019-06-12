const _ = require("lodash");

class Importer {
  readInput(input) {
    const preprocessed = this.performPreprocessing(input);
    const ast = this.readAst(preprocessed);
    return this.build(ast);
  }

  performPreprocessing(input) {
    return input;
  }

  readAst(input) {
    if (!_.isString(input)) {
      throw new Error("input must be a string");
    }

    const lexingResult = this.getLexer().tokenize(input);
    if (!_.isEmpty(lexingResult.errors)) {
      throw new Error(`Got an error while lexing input: ${_.first(lexingResult.errors).message}`);
    }

    const parser = this.getParser();
    parser.input = lexingResult.tokens;
    const parsingResult = parser.definition();

    if (!_.isEmpty(parser.errors)) {
      const firstError = _.first(parser.errors);
      const tokenPosition = `${firstError.token.startLine}:${firstError.token.startColumn}`;
      const tokenDetails = `(token ${firstError.token.image} at ${tokenPosition})`;
      const message = `${firstError.name}: ${firstError.message} ${tokenDetails}`;
      throw new Error(`Got an error while parsing input: ${message}`);
    }

    return this.getVisitor(parser).visit(parsingResult);
  }

  getLexer() {
    throw new Error("getLexer(): not yet implemented");
  }

  getParser() {
    throw new Error("getParser(): not yet implemented");
  }

  getVisitor(parser) {
    throw new Error("getVisitor(): not yet implemented");
  }

  build(ast) {
    throw new Error("build(): not yet implemented");
  }
}

module.exports = Importer;
