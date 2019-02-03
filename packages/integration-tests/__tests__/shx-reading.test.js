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
    expect(shxValue.header.shapeType).toEqual("POINT");
    console.log(shxValue);
  });
});
