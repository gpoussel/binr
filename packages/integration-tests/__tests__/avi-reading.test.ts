import { BinaryReader } from "@binr/binary-reader";
import { DefinitionReader } from "@binr/definition-reader";
import fs from "fs";

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
    expect(aviValue).toMatchSnapshot();
  });
});
