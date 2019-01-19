"use strict";

const _ = require("lodash");
const chevrotain = require("chevrotain");

function ConfigurationParser() {
  // TODO
}

function buildParser() {
  const { createToken, Lexer } = chevrotain;

  const headerToken = createToken({
    name: "header",
    pattern: /#define/,
  });

  const whitespaceToken = createToken({
    name: "whitespace",
    pattern: /\s+/,
    group: Lexer.SKIPPED,
  });

  const allTokens = [headerToken, whitespaceToken];

  return {
    lexer: new Lexer(allTokens),
  };
}

ConfigurationParser.prototype.parse = input => {
  if (!_.isString(input)) {
    throw new Error("input must be a string");
  }

  const parser = buildParser();
  console.log(parser.lexer.tokenize(input));

  return undefined;
};

module.exports = ConfigurationParser;
