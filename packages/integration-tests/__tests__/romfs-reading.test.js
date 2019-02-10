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
    const { header, entry } = value;
    expect(header).toBeDefined();
    expect(header.magicBytes).toEqual("-rom1fs-".split(""));
    expect(header.size).toBe(272);
    expect(header.checksum).toBe(1391339101);
    expect(header.volumeName).toEqual("DEFALIGNED");

    expect(entry).toBeDefined();

    const { header: entryHeader } = entry;
    expect(entryHeader).toBeDefined();
  });
});
