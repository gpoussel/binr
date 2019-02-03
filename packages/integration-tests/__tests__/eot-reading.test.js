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

  test("reads EOT file with EOT definition", () => {
    const binaryReader = new BinaryReader();
    const eotValue = binaryReader.read(fontEotBuffer, eotDefinition, "EotFile");
    expect(eotValue).toBeDefined();
    expect(eotValue.size).toBe(21764);
    expect(eotValue.version).toBe(131074);
    expect(eotValue.fontDataSize).toBe(21548);
    expect(eotValue.flags).toBeUndefined();
    expect(eotValue.fontPANOSE).toEqual([4, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    expect(eotValue.charset).toBe(0);
    expect(eotValue.italic).toBe(0);
    expect(eotValue.weight).toBe(65536);
    expect(eotValue.fsType).toBe(400);
    expect(eotValue.magicNumber).toBe(0);
    expect(eotValue.unicodeRange).toEqual([1347158020, 3758097135, 1342185563, 32]);
    expect(eotValue.codePageRange1).toBe(0);
    expect(eotValue.codePageRange2).toBe(536871327);
    expect(eotValue.checkSumAdjustment).toBe(1325465600);
    expect(eotValue.reserved1).toBe(2389338260);
    expect(eotValue.reserved2).toBe(0);
    expect(eotValue.reserved3).toBe(0);
    expect(eotValue.reserved4).toBe(0);
    expect(eotValue.padding1).toBe(0);
    expect(eotValue.familyNameSize).toBe(0);
    expect(eotValue.familyName).toHaveLength(0);
    expect(eotValue.padding2).toBe(0);
    expect(eotValue.styleNameSize).toBe(12);
    expect(eotValue.styleName).toEqual("Roboto".split(""));
    expect(eotValue.padding3).toBe(0);
    expect(eotValue.versionNameSize).toBe(14);
    expect(eotValue.versionName).toEqual("Regular".split(""));
    expect(eotValue.padding4).toBe(0);
    expect(eotValue.fullNameSize).toBe(42);
    expect(eotValue.fullName).toEqual("Version 1.00000; 2011".split(""));
    expect(eotValue.padding5).toBe(0);
    expect(eotValue.rootStringSize).toBe(28);
    expect(eotValue.rootString).toEqual("Roboto Regular".split(""));
    expect(eotValue.eudcCodePage).toBe(1346851650);
    expect(eotValue.padding6).toBe(0);
    expect(eotValue.signatureSize).toBe(0);
    expect(eotValue.signature).toHaveLength(0);
    expect(eotValue.eudcFlags).toBe(0);
    expect(eotValue.eudcFontSize).toBe(0);
    expect(eotValue.eudcFontData).toHaveLength(0);
    expect(eotValue.fontData).toHaveLength(21548);
  });
});
