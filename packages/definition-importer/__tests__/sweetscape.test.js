"use strict";

const fs = require("fs");
const _ = require("lodash");
const SweetscapeImporter = require("../lib/sweetscape/sweetscape-importer");

const structureFolder = `${__dirname}/../__fixtures__/`;

describe("Sweetscape Importer", () => {
  const importer = new SweetscapeImporter();
  _.each(["swf-sample", "vbmeta-sample"], name => {
    test(`reads ${name} definition`, () => {
      const definitionBuffer = fs.readFileSync(`${structureFolder}/${name}.bt`, "UTF-8");
      const definition = importer.readInput(definitionBuffer);

      expect(definition).toBeDefined();
    });
  });
});
