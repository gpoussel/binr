"use strict";

const _ = require("lodash");
const SweetscapeImporter = require("../lib/sweetscape/sweetscape-importer");
const { getSingleStructure, iterateStructures } = require("./utils/010-structures");

describe("Sweetscape Importer", () => {
  const importer = new SweetscapeImporter();
  test("reads misc definitions", () => {
    // The file itself is not important and does not represent any structures
    // It is only there to reach a 100% coverage on the structure parser
    // This is definitely useful for regression test during refactoring
    const definition = importer.readInput(getSingleStructure("misc-sample"));
    expect(definition).toBeDefined();
  });

  test("reads all 010 sample structures", done => {
    iterateStructures((name, input) => {
      try {
        const definition = importer.readInput(input);
        expect(definition).toBeDefined();
      } catch (e) {
        e.message = `[${name}] ${e.message}`;
        done.fail(e);
      }
    }, done);
  }, 45000);
});
