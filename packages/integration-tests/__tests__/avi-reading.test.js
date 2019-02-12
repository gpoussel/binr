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

    const firstBlock = aviValue.blocks[0];
    expect(firstBlock.nheader).toEqual("LIST");
    const { list } = firstBlock;
    expect(list).toEqual({
      datalen: 326,
      type: "hdrl",
      header: {
        data: {
          flags: 65552,
          height: 240,
          initialFrames: 0,
          length: 0,
          maxBytesPerSec: 376514,
          microSecPerFrame: 66666,
          rate: 0,
          reserved1: 0,
          scale: 0,
          start: 0,
          streams: 2,
          suggestedBufferSize: 24366,
          totalFrames: 55,
          width: 320,
        },
        datalen: 56,
        id: "avih",
      },
    });
  });
});
