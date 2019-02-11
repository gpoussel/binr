"use strict";

const fs = require("fs");
const { BinaryReader } = require("@binr/binary-reader");
const { DefinitionReader } = require("@binr/definition-reader");

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
    expect(eotValue.size).toBe(21764);
    expect(eotValue.version).toBe(131074);
    expect(eotValue.fontDataSize).toBe(21548);
    expect(eotValue.flags).toEqual(["TTEMBED_TTCOMPRESSED"]);
    expect(eotValue.fontPANOSE).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    expect(eotValue.charset).toBe(1);
    expect(eotValue.italic).toBe(0);
    expect(eotValue.weight).toBe(400);
    expect(eotValue.fsType).toBe(4);
    expect(eotValue.magicNumber).toBe(0x504c);
    expect(eotValue.unicodeRange).toEqual([3758097135, 1342185563, 32, 0]);
    expect(eotValue.codePageRange1).toBe(536871327);
    expect(eotValue.codePageRange2).toBe(1325465600);
    expect(eotValue.checkSumAdjustment).toBe(2389338260);
    expect(eotValue.reserved).toEqual([0, 0, 0, 0]);
    expect(eotValue.familyNameSize).toBe(12);
    expect(eotValue.familyName).toEqual("Roboto");
    expect(eotValue.styleNameSize).toBe(14);
    expect(eotValue.styleName).toEqual("Regular");
    expect(eotValue.versionNameSize).toBe(42);
    expect(eotValue.versionName).toEqual("Version 1.00000; 2011");
    expect(eotValue.fullNameSize).toBe(28);
    expect(eotValue.fullName).toEqual("Roboto Regular");
    expect(eotValue.rootStringSize).toBe(0);
    expect(eotValue.rootString).toHaveLength(0);
    expect(eotValue.eudcCodePage).toBe(0);
    expect(eotValue.signatureSize).toBe(0);
    expect(eotValue.signature).toHaveLength(0);
    expect(eotValue.eudcFlags).toBe(0);
    expect(eotValue.eudcFontSize).toBe(0);
    expect(eotValue.eudcFontData).toHaveLength(0);
    expect(eotValue.fontData).toHaveLength(21548);

    expect(eotValue.padding1).toBeUndefined();
    expect(eotValue.padding2).toBeUndefined();
    expect(eotValue.padding3).toBeUndefined();
    expect(eotValue.padding4).toBeUndefined();
    expect(eotValue.padding5).toBeUndefined();
    expect(eotValue.padding6).toBeUndefined();
  });
});
