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

  abstract getPreprocessor(): Preprocessor;

  abstract getLexer(): Lexer;

  abstract getParser(): CstParser;

  abstract getVisitor(parser: CstParser): any;

  private readAst(input: string): Definition {
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

    const parsingResult: Definition = parser.definition();

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

  private build(ast: Definition) {
    const builder = new DefinitionBuilder();
    return builder.build(ast);
  }
}
