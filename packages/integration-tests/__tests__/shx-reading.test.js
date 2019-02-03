"use strict";

const fs = require("fs");
const { BinaryReader } = require("@binr/binary-reader");
const { DefinitionReader } = require("@binr/definition-reader");

const pathToBinaryFixtures = `${__dirname}/../__fixtures__/binaries`;
const pathToDefinitionFixtures = `${__dirname}/../__fixtures__/definitions`;

describe("SHX reading", () => {
  const definitionReader = new DefinitionReader();

  const shxDefinitionFile = fs.readFileSync(`${pathToDefinitionFixtures}/shx.binr`);
  const shxDefinition = definitionReader.readInput(shxDefinitionFile.toString());

  const shxFile = `${pathToBinaryFixtures}/us_ski_areas.shx`;
  const shxBuffer = fs.readFileSync(shxFile);

  test("reads GIF file with GIF definition", () => {
    const binaryReader = new BinaryReader();
    const shxValue = binaryReader.read(shxBuffer, shxDefinition, "ShxFile");
    expect(shxValue).toBeDefined();

    expect(shxValue.fileHeader).toBeDefined();
    expect(shxValue.fileHeader.code).toBe(0x270a);
    expect(shxValue.fileHeader.length).toBe(2786);
    expect(shxValue.fileHeader.unused).toEqual([0, 0, 0, 0, 0]);

    expect(shxValue.header).toBeDefined();
    expect(shxValue.header.version).toBe(1000);
    expect(shxValue.header.xMin).toBeCloseTo(-122.70948, 4);
    expect(shxValue.header.yMin).toBeCloseTo(32.9493, 4);
    expect(shxValue.header.xMax).toBeCloseTo(-67.81417, 4);
    expect(shxValue.header.yMax).toBeCloseTo(48.605, 4);
    expect(shxValue.header.zMin).toBe(0);
    expect(shxValue.header.zMax).toBe(0);
    expect(shxValue.header.mMin).toBe(0);
    expect(shxValue.header.mMax).toBe(0);

    expect(shxValue.recordIndexes).toHaveLength(684);
    const firstRecordIndex = shxValue.recordIndexes[0];
    expect(firstRecordIndex.offset).toBe(50);
    expect(firstRecordIndex.length).toBe(10);

    const lastRecordIndex = shxValue.recordIndexes[683];
    expect(lastRecordIndex.offset).toBe(9612);
    expect(lastRecordIndex.length).toBe(10);
  });
});
