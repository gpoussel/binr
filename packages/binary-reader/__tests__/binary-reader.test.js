"use strict";

const fs = require("fs");
const BinaryReader = require("..");
const { Definition, Structure, Field } = require("@binr/model");
const { UintType, StringType, StructureType } = require("@binr/definition-reader");

const pathToFixtures = `${__dirname}/../__fixtures__/`;

const reader = new BinaryReader();

const gifDefinition = getGifDefinition();

function getGifDefinition() {
  const logicalScreenStructure = new Structure("logical_screen", [
    new Field("image_width", new UintType(16)),
    new Field("image_height", new UintType(16)),
    new Field("flags", new UintType(8)),
    new Field("bg_color_index", new UintType(8)),
    new Field("pixel_aspect_ratio", new UintType(8)),
  ]);
  const headerStructure = new Structure("header", [
    new Field("magic", new StringType()),
    new Field("version", new UintType(24)),
  ]);
  const gifFileStructure = new Structure("gif_file", [
    new Field("header", new StructureType(headerStructure)),
    new Field("logical_screen", new StructureType(logicalScreenStructure)),
  ]);
  const structures = [logicalScreenStructure, headerStructure, gifFileStructure];
  return new Definition(structures);
}

describe("BinaryReader", () => {
  test("throws an error on invalid arguments", () => {
    expect(() => {
      reader.read(null, new Definition());
    }).toThrow();

    expect(() => {
      reader.read(Buffer.from([]), "a");
    }).toThrow();
  });

  const treeFile = `${pathToFixtures}tree.gif`;
  const treeBuffer = fs.readFileSync(treeFile);
  test("reads file with empty definition", () => {
    reader.read(treeBuffer, new Definition([new Structure("foo", [])]));
  });

  test("reads GIF file with GIF definition", () => {
    reader.read(treeBuffer, gifDefinition, "gif_file");
  });
});
