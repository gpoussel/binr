"use strict";

const fs = require("fs");
const { BinaryReader } = require("@binr/binary-reader");
const { DefinitionReader } = require("@binr/definition-reader");

const pathToBinaryFixtures = `${__dirname}/../__fixtures__/binaries`;
const pathToDefinitionFixtures = `${__dirname}/../__fixtures__/definitions`;

describe("EOT reading", () => {
  const definitionReader = new DefinitionReader();

  const eotDefinitionFile = fs.readFileSync(`${pathToDefinitionFixtures}/eot.binr`);
  const eotDefinition = definitionReader.readInput(eotDefinitionFile.toString());

  const fontEotFile = `${pathToBinaryFixtures}/roboto-regular-webfont.eot`;
  const fontEotBuffer = fs.readFileSync(fontEotFile);

  test("reads EOT file with EOT definition", () => {
    const binaryReader = new BinaryReader();
    const eotValue = binaryReader.read(fontEotBuffer, eotDefinition, "EotFile");
    expect(eotValue).toBeDefined();
    console.log(eotValue);
  });
});
