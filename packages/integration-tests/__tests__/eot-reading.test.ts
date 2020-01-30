import * as fs from "fs";

import { BinaryReader } from "@binr/binary-reader";
import { DefinitionReader } from "@binr/definition-reader";

const pathToBinaryFixtures = `${__dirname}/../__fixtures__/binaries`;
const pathToDefinitionFixtures = `${__dirname}/../__fixtures__/definitions`;

describe("EOT reading", () => {
  const definitionReader = new DefinitionReader();

  const eotDefinitionFile = fs.readFileSync(`${pathToDefinitionFixtures}/eot.binr`);
  const eotDefinition = definitionReader.readInput(eotDefinitionFile.toString());

  const fontEotFile = `${pathToBinaryFixtures}/roboto-regular-webfont.eot`;
  const fontEotBuffer = fs.readFileSync(fontEotFile);

  test("reads EOT file", () => {
    const binaryReader = new BinaryReader();
    const eotValue = binaryReader.read(fontEotBuffer, eotDefinition, "EotFile");
    expect(eotValue).toBeDefined();
    expect(eotValue).toMatchSnapshot();
  });
});
