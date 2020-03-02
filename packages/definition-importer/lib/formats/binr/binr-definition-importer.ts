import { CstParser } from "chevrotain";

import { NoopPreprocessor, Preprocessor } from "../../common/preprocessors";
import { Importer } from "../importer";
import { BinrLexer } from "./binr-lexer";
import { BinrParser } from "./binr-parser";
import { getVisitor } from "./binr-visitor";

export class BinrDefinitionImporter extends Importer {
  public getLexer() {
    return new BinrLexer();
  }

  public getParser() {
    return new BinrParser();
  }

  public getVisitor(parser: CstParser) {
    return getVisitor(parser);
  }

  getPreprocessor(): Preprocessor {
    return new NoopPreprocessor();
  }
}
