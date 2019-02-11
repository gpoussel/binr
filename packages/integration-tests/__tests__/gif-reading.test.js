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

  test("reads GIF file", () => {
    const binaryReader = new BinaryReader();
    const gifValue = binaryReader.read(treeGifBuffer, gifDefinition, "GifFile");
    expect(gifValue).toBeDefined();

    const { logicalScreen, header, globalColorTable } = gifValue;
    expect(header).toBeDefined();
    expect(header.magic).toEqual("GIF");
    expect(header.version).toEqual("89a");

    expect(logicalScreen).toBeDefined();
    expect(logicalScreen.imageWidth).toBe(150);
    expect(logicalScreen.imageHeight).toBe(189);
    expect(logicalScreen.globalColorTable).toBe(1);
    expect(logicalScreen.colorResolution).toBe(7);
    expect(logicalScreen.sort).toBe(1);
    expect(logicalScreen.globalColorTableSize).toBe(7);
    expect(logicalScreen.backgroundColorIndex).toBe(1);
    expect(logicalScreen.pixelAspectRatio).toBe(0);

    expect(globalColorTable).toHaveLength(256);
    expect(globalColorTable[0]).toEqual({
      red: 1,
      green: 128,
      blue: 1,
    });
    expect(globalColorTable[255]).toEqual({
      red: 0,
      green: 0,
      blue: 0,
    });
  });
});
