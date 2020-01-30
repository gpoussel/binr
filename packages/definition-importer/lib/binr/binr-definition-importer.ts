import { CstParser } from "chevrotain";

import { CStylePreprocessor } from "../common/cstyle-preprocessor";
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

  public performPreprocessing(input: string) {
    const preprocessor = new CStylePreprocessor();
    return preprocessor.preprocess(input);
  }
}
