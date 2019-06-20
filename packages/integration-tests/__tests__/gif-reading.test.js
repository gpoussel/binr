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
    expect(gifValue).toMatchSnapshot();
  });
});
