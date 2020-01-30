import { Lexer } from "chevrotain";
import { values } from "lodash";

import { tokens } from "./sweetscape-tokens";

export class SweetscapeLexer extends Lexer {
  constructor() {
    super(values(tokens), {
      ensureOptimizations: true,
    });
  }
}
