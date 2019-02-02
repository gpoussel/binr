"use strict";

const fs = require("fs");
const { BinaryReader } = require("@binr/binary-reader");
const { DefinitionReader } = require("@binr/definition-reader");

const pathToBinaryFixtures = `${__dirname}/../__fixtures__/binaries`;
const pathToDefinitionFixtures = `${__dirname}/../__fixtures__/definitions`;

describe("GIF reading", () => {
  const definitionReader = new DefinitionReader();

  const gifDefinitionFile = fs.readFileSync(`${pathToDefinitionFixtures}/gif.binr`);
  const gifDefinition = definitionReader.readInput(gifDefinitionFile.toString());

  const treeGifFile = `${pathToBinaryFixtures}/tree.gif`;
  const treeGifBuffer = fs.readFileSync(treeGifFile);

  test("reads GIF file with GIF definition", () => {
    const binaryReader = new BinaryReader();
    const gifValue = binaryReader.read(treeGifBuffer, gifDefinition, "GifFile");
    expect(gifValue).toBeDefined();
    expect(gifValue.header).toBeDefined();
    expect(gifValue.header.magic).toEqual(["G", "I", "F"]);
    expect(gifValue.header.version).toEqual(["8", "9", "a"]);
    expect(gifValue.logicalScreen).toBeDefined();
    expect(gifValue.logicalScreen.imageWidth).toBe(150);
    expect(gifValue.logicalScreen.imageHeight).toBe(189);
    expect(gifValue.logicalScreen.flags).toBeDefined();
    expect(gifValue.logicalScreen.backgroundColorIndex).toBe(1);
    expect(gifValue.logicalScreen.pixelAspectRatio).toBe(0);
  });
});
