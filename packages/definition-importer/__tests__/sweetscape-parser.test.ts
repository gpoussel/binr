"use strict";

import _ from "lodash";
import { SweetscapeLexer } from "../lib/sweetscape/sweetscape-lexer";
import { SweetscapeParser } from "../lib/sweetscape/sweetscape-parser";

/**
 * This function executes the parser over input and returns the parser itself (holding the parsing result)
 * @param {string} input input text representing the input definition
 * @return {object} parsing result
 */
function parse(input) {
  const lexer = new SweetscapeLexer();
  const parser = new SweetscapeParser();

  const lexingResult = lexer.tokenize(input);
  if (!_.isEmpty(lexingResult.errors)) {
    throw new Error(`Got an error while lexing input: ${_.first(lexingResult.errors).message}`);
  }
  parser.input = lexingResult.tokens;
  return parser;
}

/**
 * Tidy up the parsing result to remove chevrotain-related stuff.
 * @param {object} object input object (parsing result)
 * @return {object} cleaned-up objeects
 */
function cleanupResult(object) {
  if (_.has(object, "tokenType")) {
    // This is a token, and we don't want to serialize all its properties
    return { TOKEN: object.tokenType.tokenName, content: object.image };
  }
  _.each(object, (value, key) => {
    if (_.isArray(value)) {
      if (_.size(value) === 1) {
        // To improve readability, remove the array and put a single object
        object[key] = cleanupResult(_.first(value));
      } else {
        object[key] = _.map(value, cleanupResult);
      }
    } else if (_.isObject(value)) {
      const result = cleanupResult(value);
      object[key] = result;
    }
  });

  if (_.has(object, "children")) {
    return object.children;
  }
  return object;
}

describe("Sweetscape Parser", () => {
  _.each(
    [
      { name: "variable definition", input: "int a;" },
      { name: "several variable definitions", input: "int a, b;" },
      { name: "variable definition with initializer", input: "int a = 1;" },
      { name: "annotated variable definition", input: "int a <format=hex>;" },
      { name: "local variable definition", input: "local int a;" },
      { name: "const variable definition", input: "const int a;" },
      { name: "variable with constant bitfield", input: "int a : 3;" },
      { name: "variable with identifier as bitfield", input: "int a : NBits;" },
      { name: "variable with expression as bitfield", input: "int a : NBits / 2;" },
      { name: "anonymous variable with bitfield", input: "int : 3;" },
      { name: "annotated anonymous variable with bitfield", input: "int : 3 <format=hex>;" },
      { name: "array variable definition", input: "int[] a;" },
      { name: "array variable definition with initializer", input: "int[] a = { 1 , 2 };" },
    ],
    (testDefinition) => {
      test(`parses statement (${testDefinition.name})`, () => {
        const parsingResult = parse(testDefinition.input);
        const statement = parsingResult.statement();
        expect(cleanupResult(statement)).toMatchSnapshot();
      });
    },
  );
  _.each(
    [
      { name: "hex number 1", input: "0x20" },
      { name: "hex number 2", input: "20h" },
      { name: "decimal number", input: "10" },
      { name: "binary number", input: "0b10" },
      { name: "octal number", input: "045" },
      { name: "string", input: "'a'" },
      { name: "prefixOperation", input: "!a" },
      { name: "infixOperation", input: "a+b" },
      { name: "postfixOperation", input: "a++" },
      { name: "assignment", input: "a = b" },
      { name: "ternary", input: "a ? 1 : 0" },
      { name: "selector", input: "a.b[c]" },
      { name: "sizeof type", input: "sizeof(int)" },
      { name: "sizeof expression", input: "sizeof(a[0])" },
      { name: "function call", input: "a(1, 2)" },
      { name: "cast", input: "(int) b" },
      { name: "parenthesized expression", input: "(a + b)" },
    ],
    (testDefinition) => {
      test(`parses expression (${testDefinition.name})`, () => {
        const parsingResult = parse(testDefinition.input);
        const statement = parsingResult.assignmentExpression();
        expect(cleanupResult(statement)).toMatchSnapshot();
      });
    },
  );
  _.each(
    [
      { name: "operator priority", input: "a * b + c" },
      { name: "operator priority with parenthesis", input: "(a * b) + c" },
      { name: "operator priority with parenthesis and cast", input: "(int) (a * b) + c" },
      { name: "operator priority with cast", input: "(int) fn(a) + 1" },
      { name: "or-and mixed", input: "a && b || c || d" },
    ],
    (testDefinition) => {
      test(`parses complex expression (${testDefinition.name})`, () => {
        const parsingResult = parse(testDefinition.input);
        const statement = parsingResult.assignmentExpression();
        expect(cleanupResult(statement)).toMatchSnapshot();
      });
    },
  );
});
