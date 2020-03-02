import { CstParser } from "chevrotain";

import { CStylePreprocessor, Preprocessor } from "../../common/preprocessors";
import { Importer } from "../importer";
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

  getPreprocessor(): Preprocessor {
    return new CStylePreprocessor();
  }
}
