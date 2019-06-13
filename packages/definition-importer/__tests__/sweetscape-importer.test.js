"use strict";

const _ = require("lodash");
const SweetscapeImporter = require("../lib/sweetscape/sweetscape-importer");
const { iterateStructures } = require("./utils/010-structures");

describe("Sweetscape Importer", () => {
  const importer = new SweetscapeImporter();

  test("creates 7-zip definition", done => {
    iterateStructures(
      (name, input) => {
        const definition = importer.readInput(input);
        expect(definition).toBeDefined();
        console.log(definition);
      },
      done,
      name => name === "SCP.bt"
    );
  }, 45000);
});
