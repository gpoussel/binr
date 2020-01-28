import { CstParser } from "chevrotain";
import { CStylePreprocessor } from "../common/cstyle-preprocessor";
import { Importer } from "../importer";
import { SweetscapeDefinitionBuilder } from "./sweetscape-builder";
import { SweetscapeLexer } from "./sweetscape-lexer";
import { SweetscapeParser } from "./sweetscape-parser";
import { getVisitor } from "./sweetscape-visitor";

export class SweetscapeDefinitionImporter extends Importer {
  public getLexer() {
    return new SweetscapeLexer();
  }

  public getParser() {
    return new SweetscapeParser();
  }

  public getVisitor(parser: CstParser) {
    return getVisitor(parser);
  }

  public performPreprocessing(input: string) {
    const preprocessor = new CStylePreprocessor();
    return preprocessor.preprocess(input);
  }

  public build(ast: any) {
    const builder = new SweetscapeDefinitionBuilder();
    return builder.build(ast);
  }
}
