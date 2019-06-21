import { first, get, isEmpty, isString } from "lodash";

export class Importer {
  public readInput(input) {
    if (!isString(input)) {
      throw new Error("input must be a string");
    }

    const preprocessed = this.performPreprocessing(input);

    if (!isString(preprocessed)) {
      throw new Error("input must be a string");
    }

    const ast = this.readAst(preprocessed);
    return this.build(ast);
  }

  public performPreprocessing(input) {
    return input;
  }

  public readAst(input) {
    const lexingResult = this.getLexer().tokenize(input);
    if (!isEmpty(lexingResult.errors)) {
      throw new Error(`Got an error while lexing input: ${first(lexingResult.errors).message}`);
    }

    const parser = this.getParser();
    parser.input = lexingResult.tokens;
    const parsingResult = parser.definition();

    if (!isEmpty(parser.errors)) {
      const firstError = first(parser.errors);
      const tokenPosition = `${firstError.token.startLine}:${firstError.token.startColumn}`;
      const tokenName = get(firstError, "token.tokenType.tokenName");
      const tokenImage = get(firstError, "token.image");
      const tokenDetails = `(token ${tokenName} "${tokenImage}" at ${tokenPosition})`;
      const message = `${firstError.name}: ${firstError.message} ${tokenDetails}`;
      throw new Error(`Got an error while parsing input: ${message}`);
    }

    return this.getVisitor(parser).visit(parsingResult);
  }

  public getLexer(): any {
    throw new Error("getLexer(): not yet implemented");
  }

  public getParser(): any {
    throw new Error("getParser(): not yet implemented");
  }

  public getVisitor(parser): any {
    throw new Error(`getVisitor(): not yet implemented (parser = ${parser})`);
  }

  public build(ast): any {
    throw new Error(`build(): not yet implemented (ast = ${ast})`);
  }
}
