import { first, isEmpty, isString } from "lodash";
import { DefinitionBuilder } from "./definition-builder";
import { DefinitionLexer } from "./definition-lexer";
import { DefinitionParser } from "./definition-parser";
import { DefinitionValidator } from "./definition-validator";
import { getVisitor } from "./definition-visitor";

export class DefinitionReader {
  private lexer: DefinitionLexer;
  private validator: DefinitionValidator;
  private builder: DefinitionBuilder;

  constructor() {
    this.lexer = new DefinitionLexer();
    this.validator = new DefinitionValidator();
    this.builder = new DefinitionBuilder();
  }

  public readInput(input) {
    const ast = this.readAst(input);

    this.validator.validate(ast);
    return this.builder.build(ast);
  }

  public readAst(input) {
    if (!isString(input)) {
      throw new Error("input must be a string");
    }

    const lexingResult = this.lexer.tokenize(input);
    if (!isEmpty(lexingResult.errors)) {
      throw new Error(`Got an error while lexing input: ${first(lexingResult.errors).message}`);
    }

    const parser = new DefinitionParser();
    parser.input = lexingResult.tokens;
    const parsingResult = parser.definition();

    if (!isEmpty(parser.errors)) {
      const firstError = first(parser.errors);
      const tokenPosition = `${firstError.token.startLine}:${firstError.token.startColumn}`;
      const tokenDetails = `(token ${firstError.token.image} at ${tokenPosition})`;
      const message = `${firstError.name}: ${firstError.message} ${tokenDetails}`;
      throw new Error(`Got an error while parsing input: ${message}`);
    }

    const visitor = getVisitor(parser);
    return visitor.visit(parsingResult);
  }
}
