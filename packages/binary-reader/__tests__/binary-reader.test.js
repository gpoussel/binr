"use strict";

const fs = require("fs");
const BinaryReader = require("..");
const { Definition, Structure, Field } = require("@binr/model");

const pathToFixtures = `${__dirname}/../__fixtures__/`;

const reader = new BinaryReader();

const gifDefinition = getGifDefinition();

function getGifDefinition() {
  const structures = [
    new Structure("header", [new Field("magic", "string"), new Field("version", "uint:24")]),
    new Structure("logical_screen", [
      new Field("image_width", "uint:16"),
      new Field("image_height", "uint:16"),
      new Field("flags", "uint:8"),
      new Field("bg_color_index", "uint:8"),
      new Field("pixel_aspect_ratio", "uint:8"),
    ]),
    new Structure("gif_file", [new Field("header", "header"), new Field("logical_screen", "logical_screen")]),
  ];
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
