"use strict";

import { BinaryReader } from "@binr/binary-reader";
import { DefinitionReader } from "@binr/definition-reader";
import fs from "fs";

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
    expect(value).toMatchSnapshot();
  });
});
