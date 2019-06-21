import { BinaryReader } from "@binr/binary-reader";
import { DefinitionReader } from "@binr/definition-reader";
import * as fs from "fs";

const pathToBinaryFixtures = `${__dirname}/../__fixtures__/binaries`;
const pathToDefinitionFixtures = `${__dirname}/../__fixtures__/definitions`;

describe("RAR reading", () => {
  const definitionReader = new DefinitionReader();

  const rarDefinitionFile = fs.readFileSync(`${pathToDefinitionFixtures}/rar.binr`);
  const rarDefinition = definitionReader.readInput(rarDefinitionFile.toString());

  const archiveRarFile = `${pathToBinaryFixtures}/sample.rar`;
  const archiveRarBuffer = fs.readFileSync(archiveRarFile);

  test("reads RAR file", () => {
    const binaryReader = new BinaryReader();
    const archive = binaryReader.read(archiveRarBuffer, rarDefinition, "RarFile");
    expect(archive).toBeDefined();
    expect(archive).toMatchSnapshot();
  });
});
