"use strict";

const _ = require("lodash");

const fs = require("fs");
const { BinaryReader } = require("@binr/binary-reader");
const { DefinitionReader } = require("@binr/definition-reader");

const pathToBinaryFixtures = `${__dirname}/../__fixtures__/binaries`;
const pathToDefinitionFixtures = `${__dirname}/../__fixtures__/definitions`;

describe("WMF reading", () => {
  const definitionReader = new DefinitionReader();

  const wmfDefinitionFile = fs.readFileSync(`${pathToDefinitionFixtures}/wmf.binr`);
  const wmfDefinition = definitionReader.readInput(wmfDefinitionFile.toString());

  const wmfFile = `${pathToBinaryFixtures}/sample.wmf`;
  const wmfBuffer = fs.readFileSync(wmfFile);

  test("reads WMF file", () => {
    const binaryReader = new BinaryReader();
    const wmfValue = binaryReader.read(wmfBuffer, wmfDefinition, "WmfFile");
    expect(wmfValue).toBeDefined();

    const { specialHeader, header, records } = wmfValue;
    expect(specialHeader).toEqual({
      magicNumber: 2596720087,
      handle: 0,
      left: 61528,
      top: 62158,
      right: 4008,
      bottom: 3378,
      inch: 1000,
      reserved: 0,
      checksum: 21749,
    });

    expect(header).toEqual({
      fileType: "MEMORY",
      headerSize: 9,
      version: 768,
      size: 34071,
      objectsCount: 4,
      maxRecords: 6896,
      membersCount: 0,
    });

    expect(records).toHaveLength(221);
    expect(records[220]).toEqual({
      fn: "EOF",
      params: [],
      size: 3,
    });
  });
});
