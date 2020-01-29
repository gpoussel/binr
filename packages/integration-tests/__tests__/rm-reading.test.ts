import * as fs from "fs";

import { BinaryReader } from "@binr/binary-reader";
import { DefinitionReader } from "@binr/definition-reader";

const pathToBinaryFixtures = `${__dirname}/../__fixtures__/binaries`;
const pathToDefinitionFixtures = `${__dirname}/../__fixtures__/definitions`;

describe("RM reading", () => {
  const definitionReader = new DefinitionReader();

  const rmDefinitionFile = fs.readFileSync(`${pathToDefinitionFixtures}/rm.binr`);
  const rmDefinition = definitionReader.readInput(rmDefinitionFile.toString());

  const videoRmFile = `${pathToBinaryFixtures}/video.rm`;
  const videoRmBuffer = fs.readFileSync(videoRmFile);

  test("reads RM file", () => {
    const binaryReader = new BinaryReader();
    const videoValue = binaryReader.read(videoRmBuffer, rmDefinition, "RmFile");
    expect(videoValue).toBeDefined();
    expect(videoValue).toMatchSnapshot();
  });
});
