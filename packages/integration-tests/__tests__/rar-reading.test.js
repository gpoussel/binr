"use strict";

const fs = require("fs");
const { BinaryReader } = require("@binr/binary-reader");
const { DefinitionReader } = require("@binr/definition-reader");

const pathToBinaryFixtures = `${__dirname}/../__fixtures__/binaries`;
const pathToDefinitionFixtures = `${__dirname}/../__fixtures__/definitions`;

describe("RAR reading", () => {
  const definitionReader = new DefinitionReader();

  const rarDefinitionFile = fs.readFileSync(`${pathToDefinitionFixtures}/rar.binr`);
  const rarDefinition = definitionReader.readInput(rarDefinitionFile.toString());

  const archiveRarFile = `${pathToBinaryFixtures}/sample.rar`;
  const archiveRarBuffer = fs.readFileSync(archiveRarFile);

  test("reads RAR file", () => {
    const binaryReader = new BinaryReader();
    const archive = binaryReader.read(archiveRarBuffer, rarDefinition, "RarFile");
    expect(archive).toBeDefined();
    expect(archive.signature).toBeDefined();

    const { header } = archive;
    expect(header).toBeDefined();
    expect(header.crc).toBe(37071);
    expect(header.type).toBe("ARCHIVE");
    expect(header.headerFlags).toHaveLength(0);
    expect(header.headerSize).toBe(13);

    const { blocks } = archive;
    console.log(blocks);
    console.log(blocks.length);
  });
});
