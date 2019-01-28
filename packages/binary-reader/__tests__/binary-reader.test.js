"use strict";

const fs = require("fs");
const BinaryReader = require("..");
const { Definition, Structure, Field } = require("@binr/model");
const { UintType, ArrayType, CharType, StructureType } = require("@binr/definition-reader");

const pathToFixtures = `${__dirname}/../__fixtures__/`;

const reader = new BinaryReader();

const gifDefinition = getGifDefinition();
const rmDefinition = getRmDefinition();

function getGifDefinition() {
  // Source: https://www.sweetscape.com/010editor/repository/files/GIF.bt

  const logicalScreenStructure = new Structure("logical_screen", [
    new Field("imageWidth", new UintType(16)),
    new Field("imageHeight", new UintType(16)),
    new Field("flags", new UintType(8)), // TODO: Use bit fields
    new Field("backgroundColorIndex", new UintType(8)),
    new Field("pixelAspectRatio", new UintType(8)),
  ]);
  logicalScreenStructure.setEndianness("little");
  const headerStructure = new Structure("header", [
    new Field("signature", new ArrayType(new CharType(), "(function() { return 3; })")),
    new Field("version", new ArrayType(new CharType(), "(function() { return 3; })")),
  ]);
  headerStructure.setEndianness("little");
  const gifFileStructure = new Structure("gif_file", [
    new Field("header", new StructureType(headerStructure)),
    new Field("logicalScreen", new StructureType(logicalScreenStructure)),
  ]);
  gifFileStructure.setEndianness("little");
  const structures = [logicalScreenStructure, headerStructure, gifFileStructure];
  return new Definition(structures);
}

function getRmDefinition() {
  // Source: https://www.sweetscape.com/010editor/repository/files/RM.bt

  const headerStructure = new Structure("header", [
    new Field("type", new ArrayType(new CharType(), "(function() { return 4; })")),
    new Field("size", new UintType(32)),
    new Field("version", new UintType(16)),
    new Field("fileVersion", new UintType(32)),
    new Field("numberOfHeaders", new UintType(32)),
  ]);
  headerStructure.setEndianness("big");
  const propertiesStructure = new Structure("properties", [
    new Field("type", new ArrayType(new CharType(), "(function() { return 4; })")),
    new Field("size", new UintType(32)),
    new Field("version", new UintType(16)),
    new Field("maxBitRate", new UintType(32)),
    new Field("averageBitRate", new UintType(32)),
    new Field("maxDataPacketSize", new UintType(32)),
    new Field("averageDataPacketSize", new UintType(32)),
    new Field("numOfPackets", new UintType(32)),
    new Field("durationInMS", new UintType(32)),
    new Field("playbackSuggestedInMS", new UintType(32)),
    new Field("firstINDXOffset", new UintType(32)),
    new Field("firstDATAOffset", new UintType(32)),
    new Field("numberOfStreams", new UintType(16)),
    new Field("flags", new UintType(16)),
  ]);
  propertiesStructure.setEndianness("big");
  const mediaDescriptionStructure = new Structure("content_description", [
    new Field("type", new ArrayType(new CharType(), "(function() { return 4; })")),
    new Field("size", new UintType(32)),
    new Field("version", new UintType(16)),
    new Field("numOfStream", new UintType(16)),
    new Field("maxBitRate", new UintType(32)),
    new Field("averageBitRate", new UintType(32)),
    new Field("maxDataPacketSize", new UintType(32)),
    new Field("averageDataPacketSize", new UintType(32)),
    new Field("startOffset", new UintType(32)),
    new Field("preroll", new UintType(32)),
    new Field("duration", new UintType(32)),
    new Field("descriptionSize", new UintType(8)),
    new Field(
      "description",
      new ArrayType(new UintType(8), "(function(scope) { return scope.get('descriptionSize'); })")
    ),
    new Field("streamMimeTypeSize", new UintType(8)),
    new Field(
      "streamMimeType",
      new ArrayType(new UintType(8), "(function(scope) { return scope.get('streamMimeTypeSize'); })")
    ),
    new Field("specificTypeDataSize", new UintType(32)),
    new Field(
      "specificTypeData",
      new ArrayType(new UintType(8), "(function(scope) { return scope.get('specificTypeDataSize'); })")
    ),
  ]);
  mediaDescriptionStructure.setEndianness("big");
  const fileStructure = new Structure("rm_file", [
    new Field("header", new StructureType(headerStructure)),
    new Field("properties", new StructureType(propertiesStructure)),
    new Field("mediaDescription", new StructureType(mediaDescriptionStructure)),
  ]);
  fileStructure.setEndianness("big");
  return new Definition([headerStructure, propertiesStructure, mediaDescriptionStructure, fileStructure]);
}

describe("BinaryReader", () => {
  test("throws an error on invalid arguments", () => {
    expect(() => {
      reader.read(null, new Definition());
    }).toThrow();

    expect(() => {
      reader.read(Buffer.from([]), "a");
    }).toThrow();
  });

  const treeGifFile = `${pathToFixtures}tree.gif`;
  const treeGifBuffer = fs.readFileSync(treeGifFile);

  const videoRmFile = `${pathToFixtures}video.rm`;
  const videoRmBuffer = fs.readFileSync(videoRmFile);

  test("reads file with empty definition", () => {
    reader.read(treeGifBuffer, new Definition([new Structure("foo", [])]));
  });

  test("reads GIF file with GIF definition", () => {
    const gifValue = reader.read(treeGifBuffer, gifDefinition, "gif_file");
    expect(gifValue).toBeDefined();
    expect(gifValue.header).toBeDefined();
    expect(gifValue.header.signature).toEqual(["G", "I", "F"]);
    expect(gifValue.header.version).toEqual(["8", "9", "a"]);
    expect(gifValue.logicalScreen).toBeDefined();
    expect(gifValue.logicalScreen.imageWidth).toBe(150);
    expect(gifValue.logicalScreen.imageHeight).toBe(189);
    expect(gifValue.logicalScreen.flags).toBeDefined();
    expect(gifValue.logicalScreen.backgroundColorIndex).toBe(1);
    expect(gifValue.logicalScreen.pixelAspectRatio).toBe(0);
  });

  test("reads RM file with RM definition", () => {
    const videoValue = reader.read(videoRmBuffer, rmDefinition, "rm_file");
    expect(videoValue).toBeDefined();
    expect(videoValue.header).toEqual({
      type: [".", "R", "M", "F"],
      size: 18,
      version: 1,
      fileVersion: 0,
      numberOfHeaders: 7,
    });
    expect(videoValue.properties).toEqual({
      type: ["P", "R", "O", "P"],
      size: 50,
      version: 0,
      maxBitRate: 40000,
      averageBitRate: 40000,
      maxDataPacketSize: 607,
      averageDataPacketSize: 426,
      numOfPackets: 132,
      durationInMS: 8637,
      playbackSuggestedInMS: 5069,
      firstINDXOffset: 58946,
      firstDATAOffset: 998,
      numberOfStreams: 3,
      flags: 11,
    });
    expect(videoValue.mediaDescription).toEqual({
      type: ["M", "D", "P", "R"],
      size: 164,
      version: 0,
      numOfStream: 0,
      maxBitRate: 6000,
      averageBitRate: 6000,
      maxDataPacketSize: 288,
      averageDataPacketSize: 288,
      startOffset: 0,
      preroll: 2304,
      duration: 9200,
      descriptionSize: 12,
      description: [65, 117, 100, 105, 111, 32, 83, 116, 114, 101, 97, 109],
      streamMimeTypeSize: 20,
      streamMimeType: [
        97,
        117,
        100,
        105,
        111,
        47,
        120,
        45,
        112,
        110,
        45,
        114,
        101,
        97,
        108,
        97,
        117,
        100,
        105,
        111,
      ],
      specificTypeDataSize: 86,
      specificTypeData: [
        46,
        114,
        97,
        -3,
        0,
        5,
        0,
        0,
        46,
        114,
        97,
        53,
        -127,
        -105,
        110,
        -108,
        0,
        5,
        0,
        0,
        0,
        70,
        0,
        8,
        0,
        0,
        1,
        32,
        0,
        0,
        27,
        0,
        0,
        0,
        -81,
        -56,
        0,
        -84,
        68,
        0,
        0,
        6,
        1,
        32,
        0,
        24,
        0,
        0,
        0,
        0,
        31,
        64,
        0,
        0,
        31,
        64,
        0,
        0,
        0,
        16,
        0,
        1,
        103,
        101,
        110,
        114,
        99,
        111,
        111,
        107,
        1,
        7,
        0,
        0,
        0,
        0,
        0,
        8,
        1,
        0,
        0,
        2,
        1,
        0,
        0,
        9,
      ],
    });
  });
});
