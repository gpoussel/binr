import { Definition } from "@binr/ast";
import { CstParser, IRecognitionException, Lexer } from "chevrotain";
import { first, get, isEmpty, isString, join, map } from "lodash";

import { DefinitionBuilder } from "./common/definition-builder";
import { Preprocessor } from "./common/preprocessors";

export abstract class Importer {
  public readInput(input: string): Definition {
    if (!isString(input)) {
      throw new Error("input must be a string");
    }

    const preprocessor = this.getPreprocessor();
    const preprocessed = preprocessor.preprocess(input);

    if (!isString(preprocessed)) {
      throw new Error("input must be a string");
    }

    const ast = this.readAst(preprocessed);
    return this.build(ast);
  }

  public readAst(input: string) {
    const lexingResult = this.getLexer().tokenize(input);
    if (!isEmpty(lexingResult.errors)) {
      throw new Error(
        `Got an error while lexing input: ${join(
          map(lexingResult.errors, (err) => err.message),
          ", ",
        )}`,
      );
    }

    const parser = this.getParser() as any;
    parser.input = lexingResult.tokens;

    // TODO typesafe with "definition"?
    const parsingResult = parser.definition();

    const errors: IRecognitionException[] = parser.errors;
    if (!isEmpty(errors)) {
      const firstError: IRecognitionException = first(errors)!;
      const tokenPosition = `${firstError.token.startLine}:${firstError.token.startColumn}`;
      const tokenName = get(firstError, "token.tokenType.name");
      const tokenImage = get(firstError, "token.image");
      const tokenDetails = `(token ${tokenName} "${tokenImage}" at ${tokenPosition})`;
      const message = `${firstError.name}: ${firstError.message} ${tokenDetails}`;
      throw new Error(`Got an error while parsing input: ${message}`);
    }

    return this.getVisitor(parser).visit(parsingResult);
  }

  abstract getPreprocessor(): Preprocessor;

  public build(ast: Definition) {
    const builder = new DefinitionBuilder();
    return builder.build(ast);
  }

  public getLexer(): Lexer {
    throw new Error("getLexer(): not yet implemented");
  }

  public getParser(): CstParser {
    throw new Error("getParser(): not yet implemented");
  }

  public getVisitor(parser: CstParser): any {
    throw new Error(`getVisitor(): not yet implemented (parser = ${parser})`);
  }
}
