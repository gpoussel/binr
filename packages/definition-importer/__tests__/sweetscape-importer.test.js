"use strict";

const SweetscapeImporter = require("../lib/sweetscape/sweetscape-importer");
const { iterateStructures, getSingleStructure } = require("./utils/010-structures");

describe("Sweetscape Importer", () => {
  const importer = new SweetscapeImporter();

  test("creates misc definitions", () => {
    // The file itself is not important and does not represent any structures
    // It is only there to reach a 100% coverage on the structure parser
    // This is definitely useful for regression test during refactoring
    const definition = importer.readInput(getSingleStructure("misc-sample"));
    expect(definition).toBeDefined();
  });

  test("creates all 010 sample definitions", done => {
    // We are keeping the state right there, so we can stop the iteration
    // as soon as we got a failure
    let hasFailed = false;
    iterateStructures(
      (name, input) => {
        try {
          const definition = importer.readInput(input);
          expect(definition).toBeDefined();
        } catch (e) {
          e.message = `[${name}] ${e.message}`;
          done.fail(e);
          hasFailed = true;
        }
      },
      done,
      () => !hasFailed
    );
  }, 45000);

  test("creates EXE definition", done => {
    iterateStructures(
      (name, input) => {
        const definition = importer.readInput(input);
        expect(definition).toBeDefined();
        expect(definition.type).toEqual("definition");
        const { content } = definition;

        expect(content).toHaveLength(93);
        expect(content).toMatchSnapshot();
      },
      done,
      name => name === "EXE.bt"
    );
  });

  test("creates DEX definition", done => {
    iterateStructures(
      (name, input) => {
        const definition = importer.readInput(input);
        expect(definition).toBeDefined();
        expect(definition.type).toEqual("definition");
        const { content } = definition;

        expect(content).toHaveLength(155);
        expect(content).toMatchSnapshot();
      },
      done,
      name => name === "DEX.bt"
    );
  });
});
