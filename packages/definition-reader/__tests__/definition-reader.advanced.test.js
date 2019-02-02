"use strict";

const fs = require("fs");
const _ = require("lodash");
const DefinitionReader = require("../lib/definition-reader");

const pathToFixtures = `${__dirname}/../__fixtures__/`;

describe("DefinitionReader, advanced", () => {
  // Note: these definitions are not complete at all. They are often inspired by
  // a real-world format but they are never fully implemented.
  test(`parses example format definition`, () => {
    _.each(["class.binr", "bmp.binr", "mft.binr"], filename => {
      const structure = fs.readFileSync(`${pathToFixtures}/${filename}`, "utf-8");
      const reader = new DefinitionReader();
      const definition = reader.readInput(structure);
      expect(definition).toBeDefined();
    });
  });
});
