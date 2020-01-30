import { Lexer } from "chevrotain";
import { values } from "lodash";

import { tokens } from "./binr-tokens";

export class BinrLexer extends Lexer {
  constructor() {
    super(values(tokens), {
      ensureOptimizations: true,
    });
  }
}
