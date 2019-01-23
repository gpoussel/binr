"use strict";

const fs = require("fs");
const BinaryReader = require("..");
const { Definition, Structure, Field } = require("@binr/model");
const { UintType, StringType, StructureType } = require("@binr/definition-reader");

const pathToFixtures = `${__dirname}/../__fixtures__/`;

const reader = new BinaryReader();

const gifDefinition = getGifDefinition();

function getGifDefinition() {
  // Source: https://www.sweetscape.com/010editor/repository/files/GIF.bt

  const logicalScreenStructure = new Structure("logical_screen", [
    new Field("imageWidth", new UintType(16)),
    new Field("imageHeight", new UintType(16)),
    new Field("flags", new UintType(8)), // TODO: Use bit fields
    new Field("backgroundColorIndex", new UintType(8)),
    new Field("pixelAspectRatio", new UintType(8)),
  ]);
  const headerStructure = new Structure("header", [
    new Field("signature", new StringType(3)),
    new Field("version", new StringType(3)),
  ]);
  const gifFileStructure = new Structure("gif_file", [
    new Field("header", new StructureType(headerStructure)),
    new Field("logicalScreen", new StructureType(logicalScreenStructure)),
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
    const gifValue = reader.read(treeBuffer, gifDefinition, "gif_file");
    expect(gifValue).toBeDefined();
    expect(gifValue.header).toBeDefined();
    expect(gifValue.header.signature).toBe("GIF");
    expect(gifValue.header.version).toBe("89a");
    expect(gifValue.logicalScreen).toBeDefined();
    expect(gifValue.logicalScreen.imageWidth).toBe(150);
    expect(gifValue.logicalScreen.imageHeight).toBe(189);
    expect(gifValue.logicalScreen.flags).toBeDefined();
    expect(gifValue.logicalScreen.backgroundColorIndex).toBe(1);
    expect(gifValue.logicalScreen.pixelAspectRatio).toBe(0);
  });
});
