"use strict";

const _ = require("lodash");
const chevrotain = require("chevrotain");
const { tokens } = require("./sweetscape-tokens");

const { Lexer } = chevrotain;

export class SweetscapeLexer extends Lexer {
  constructor() {
    super(_.values(tokens), {
      ensureOptimizations: true,
    });
  }
}
