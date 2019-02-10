"use strict";

const _ = require("lodash");

const fs = require("fs");
const { BinaryReader } = require("@binr/binary-reader");
const { DefinitionReader } = require("@binr/definition-reader");

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

    const { iconDir } = icoValue;
    expect(iconDir).toBeDefined();
    expect(iconDir.reserved).toBe(0);
    expect(iconDir.type).toBe(1);
    expect(iconDir.count).toBe(2);

    const expectedSizes = [16, 32];
    const { entries } = iconDir;
    expect(entries.map(e => e.width)).toEqual(expectedSizes);
    expect(entries.map(e => e.height)).toEqual(expectedSizes);
    expect(entries.map(e => e.colorCount)).toEqual(_.times(2, () => 0));
    expect(entries.map(e => e.reserved)).toEqual(_.times(2, () => 0));
    expect(entries.map(e => e.planes)).toEqual(_.times(2, () => 1));
    expect(entries.map(e => e.bitCount)).toEqual(_.times(2, () => 32));

    const { images } = icoValue;
    expect(images).toHaveLength(1);
    const [firstImage] = images;
    expect(firstImage.header).toEqual({
      size: 40,
      width: 16,
      height: 32,
      planes: 1,
      bitCount: 32,
      compression: 0,
      sizeImage: 0,
      xPelsPerMeter: 0,
      yPelsPerMeter: 0,
      clrUsed: 0,
      clrImportant: 0,
    });
  });
});
