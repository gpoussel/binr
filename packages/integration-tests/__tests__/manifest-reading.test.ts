"use strict";

import { BinaryReader } from "@binr/binary-reader";
import { DefinitionReader } from "@binr/definition-reader";
import fs from "fs";

const pathToBinaryFixtures = `${__dirname}/../__fixtures__/binaries`;
const pathToDefinitionFixtures = `${__dirname}/../__fixtures__/definitions`;

describe("Android Manifest reading", () => {
  const definitionReader = new DefinitionReader();

  const manifestDefinitionFile = fs.readFileSync(`${pathToDefinitionFixtures}/manifest.binr`);
  const manifestDefinition = definitionReader.readInput(manifestDefinitionFile.toString());

  const manifestFile = `${pathToBinaryFixtures}/AndroidManifest.xml`;
  const manifestBuffer = fs.readFileSync(manifestFile);

  test("reads Manifest file", () => {
    const binaryReader = new BinaryReader();
    const manifest = binaryReader.read(manifestBuffer, manifestDefinition, "ManifestFile");
    expect(manifest).toBeDefined();
    expect(manifest).toMatchSnapshot();
  });
});
