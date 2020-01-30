import * as fs from "fs";

import { BinaryReader } from "@binr/binary-reader";
import { DefinitionReader } from "@binr/definition-reader";

const pathToBinaryFixtures = `${__dirname}/../__fixtures__/binaries`;
const pathToDefinitionFixtures = `${__dirname}/../__fixtures__/definitions`;

describe("WMF reading", () => {
  const definitionReader = new DefinitionReader();

  const wmfDefinitionFile = fs.readFileSync(`${pathToDefinitionFixtures}/wmf.binr`);
  const wmfDefinition = definitionReader.readInput(wmfDefinitionFile.toString());

  const wmfFile = `${pathToBinaryFixtures}/sample.wmf`;
  const wmfBuffer = fs.readFileSync(wmfFile);

  test("reads WMF file", () => {
    const binaryReader = new BinaryReader();
    const wmfValue = binaryReader.read(wmfBuffer, wmfDefinition, "WmfFile");
    expect(wmfValue).toBeDefined();
    expect(wmfValue).toMatchSnapshot();
  });
});
