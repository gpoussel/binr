"use strict";

const fs = require("fs");
const { BinaryReader } = require("@binr/binary-reader");
const { DefinitionReader } = require("@binr/definition-reader");

const pathToBinaryFixtures = `${__dirname}/../__fixtures__/binaries`;
const pathToDefinitionFixtures = `${__dirname}/../__fixtures__/definitions`;

describe("AVI reading", () => {
  const definitionReader = new DefinitionReader();

  const aviDefinitionFile = fs.readFileSync(`${pathToDefinitionFixtures}/avi.binr`);
  const aviDefinition = definitionReader.readInput(aviDefinitionFile.toString());

  const aviFile = `${pathToBinaryFixtures}/MVI_3572.AVI`;
  const aviBuffer = fs.readFileSync(aviFile);

  test("reads AVI file", () => {
    const binaryReader = new BinaryReader();
    const aviValue = binaryReader.read(aviBuffer, aviDefinition, "AviFile");
    expect(aviValue).toBeDefined();

    const { root } = aviValue;
    expect(root.id).toEqual("RIFF");
    expect(root.datalen).toBe(904606);
    expect(root.form).toEqual("AVI ");
    console.log(aviValue);
  });
});
