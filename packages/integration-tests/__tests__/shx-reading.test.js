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

  test("reads SHX file", () => {
    const binaryReader = new BinaryReader();
    const shxValue = binaryReader.read(shxBuffer, shxDefinition, "ShxFile");
    expect(shxValue).toBeDefined();
    expect(shxValue).toMatchSnapshot();
  });
});
