"use strict";

const fs = require("fs");
const { BinaryReader } = require("@binr/binary-reader");
const { DefinitionReader } = require("@binr/definition-reader");

const pathToBinaryFixtures = `${__dirname}/../__fixtures__/binaries`;
const pathToDefinitionFixtures = `${__dirname}/../__fixtures__/definitions`;

describe("Android Manifest reading", () => {
  const definitionReader = new DefinitionReader();

  const manifestDefinitionFile = fs.readFileSync(`${pathToDefinitionFixtures}/manifest.binr`);
  const manifestDefinition = definitionReader.readInput(manifestDefinitionFile.toString());

  const manifestFile = `${pathToBinaryFixtures}/AndroidManifest.xml`;
  const manifestBuffer = fs.readFileSync(manifestFile);

  test("reads Manifest file", () => {
    const binaryReader = new BinaryReader();
    const manifest = binaryReader.read(manifestBuffer, manifestDefinition, "ManifestFile");
    expect(manifest).toBeDefined();

    const { header } = manifest;
    expect(header.magicNumber).toBe(524291);
    expect(header.fileSize).toBe(1324);

    const { stringChunk } = manifest;
    expect(stringChunk.signature).toBe(1835009);
    expect(stringChunk.size).toBe(724);
    expect(stringChunk.stringCount).toBe(19);
    expect(stringChunk.styleCount).toBe(0);
    expect(stringChunk.stringPoolOffset).toBe(104);
    expect(stringChunk.stylePoolOffset).toBe(0);
    expect(stringChunk.stringOffsets).toEqual([
      0,
      26,
      82,
      96,
      108,
      126,
      214,
      218,
      236,
      256,
      322,
      354,
      380,
      400,
      428,
      458,
      474,
      530,
      550,
    ]);
    expect(stringChunk.styleOffsets).toHaveLength(0);
  });
});
