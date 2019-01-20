"use strict";

const fs = require("fs");
const BinaryReader = require("..");
const { Definition, Structure } = require("@binr/model");

const pathToFixtures = `${__dirname}/../__fixtures__/`;

const reader = new BinaryReader();

const gifDefinition = getGifDefinition();

function getGifDefinition() {
  const structures = [
    new Structure("header", []),
    new Structure("logical_screen", []),
    new Structure("gif_file", []),
  ];
  return new Definition(structures);
  // struct header {
  //   string magic = "GIF";
  //   uint: 24 version;
  // }
  // struct logical_screen {
  //   uint: 16 image_width;
  //   uint: 16 image_height;
  //   uint: 8 flags;
  //   uint: 8 bg_color_index;
  //   uint: 8 pixel_aspect_ratio;
  // }
  // /* Main Structure */
  // export struct gif_file {
  //   header header;
  //   logical_screen logical_screen;
  // }
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
