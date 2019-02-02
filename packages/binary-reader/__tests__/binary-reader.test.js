"use strict";

const fs = require("fs");
const BinaryReader = require("..");
const { Definition, Structure, Field } = require("@binr/model");
const { UintType, ArrayType, CharType, StructureType } = require("@binr/definition-reader");

const pathToBinaryFixtures = `${__dirname}/../__fixtures__/binaries/`;
const pathToDefinitionFixtures = `${__dirname}/../__fixtures__/definitions/`;

const adescribe = () => 1;
adescribe("BinaryReader", () => {
  test("throws an error on invalid arguments", () => {
    expect(() => {
      reader.read(null, new Definition());
    }).toThrow();

    expect(() => {
      reader.read(Buffer.from([]), "a");
    }).toThrow();
  });

  const treeGifFile = `${pathToBinaryFixtures}tree.gif`;
  const treeGifBuffer = fs.readFileSync(treeGifFile);

  const videoRmFile = `${pathToBinaryFixtures}video.rm`;
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
