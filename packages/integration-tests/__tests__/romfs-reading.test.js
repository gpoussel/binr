"use strict";

const fs = require("fs");
const { BinaryReader } = require("@binr/binary-reader");
const { DefinitionReader } = require("@binr/definition-reader");

const pathToBinaryFixtures = `${__dirname}/../__fixtures__/binaries`;
const pathToDefinitionFixtures = `${__dirname}/../__fixtures__/definitions`;

describe("ROMFS reading", () => {
  const definitionReader = new DefinitionReader();
  const romfsDefinitionFile = fs.readFileSync(`${pathToDefinitionFixtures}/romfs.binr`);
  const romfsDefinition = definitionReader.readInput(romfsDefinitionFile.toString());

  const sampleRomfsFile = `${pathToBinaryFixtures}/sample.romfs`;
  const sampleRomfsBuffer = fs.readFileSync(sampleRomfsFile);

  test("reads ROMFS file", () => {
    const binaryReader = new BinaryReader();
    const value = binaryReader.read(sampleRomfsBuffer, romfsDefinition, "RomfsFile");
    expect(value).toBeDefined();
    expect(value).toMatchSnapshot();
  });
});
