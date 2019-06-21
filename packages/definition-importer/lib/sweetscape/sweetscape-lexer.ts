import { Lexer } from "chevrotain";
import _ from "lodash";
import { tokens } from "./sweetscape-tokens";

export class SweetscapeLexer extends Lexer {
  constructor() {
    super(_.values(tokens), {
      ensureOptimizations: true,
    });
  }
}
