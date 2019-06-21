const _ = require("lodash");

import { BinaryReader } from "@binr/binary-reader";
import { DefinitionReader } from "@binr/definition-reader";
import fs from "fs";

const pathToBinaryFixtures = `${__dirname}/../__fixtures__/binaries`;
const pathToDefinitionFixtures = `${__dirname}/../__fixtures__/definitions`;

describe("ICO reading", () => {
  const definitionReader = new DefinitionReader();

  const icoDefinitionFile = fs.readFileSync(`${pathToDefinitionFixtures}/ico.binr`);
  const icoDefinition = definitionReader.readInput(icoDefinitionFile.toString());

  const icoFile = `${pathToBinaryFixtures}/bing.ico`;
  const icoBuffer = fs.readFileSync(icoFile);

  test("reads ICO file", () => {
    const binaryReader = new BinaryReader();
    const icoValue = binaryReader.read(icoBuffer, icoDefinition, "IcoFile");
    expect(icoValue).toBeDefined();
    expect(icoValue).toMatchSnapshot();
  });
});
