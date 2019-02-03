"use strict";

const fs = require("fs");
const { BinaryReader } = require("@binr/binary-reader");
const { DefinitionReader } = require("@binr/definition-reader");

const pathToBinaryFixtures = `${__dirname}/../__fixtures__/binaries`;
const pathToDefinitionFixtures = `${__dirname}/../__fixtures__/definitions`;

describe("RM reading", () => {
  const definitionReader = new DefinitionReader();

  const rmDefinitionFile = fs.readFileSync(`${pathToDefinitionFixtures}/rm.binr`);
  const rmDefinition = definitionReader.readInput(rmDefinitionFile.toString());

  const videoRmFile = `${pathToBinaryFixtures}/video.rm`;
  const videoRmBuffer = fs.readFileSync(videoRmFile);

  test("reads RM file with RM definition", () => {
    const binaryReader = new BinaryReader();
    const videoValue = binaryReader.read(videoRmBuffer, rmDefinition, "RmFile");
    expect(videoValue).toBeDefined();
    expect(videoValue.header).toEqual({
      type: ".RMF".split(""),
      size: 18,
      version: 1,
      fileVersion: 0,
      numberOfHeaders: 7,
    });
    expect(videoValue.properties).toEqual({
      type: "PROP".split(""),
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
    expect(videoValue.mediaDescription).toEqual([
      {
        type: "MDPR".split(""),
        size: 164,
        version: 0,
        numberOfStreams: 0,
        maxBitRate: 6000,
        averageBitRate: 6000,
        maxDataPacketSize: 288,
        averageDataPacketSize: 288,
        startOffset: 0,
        preroll: 2304,
        duration: 9200,
        descriptionSize: 12,
        description: "Audio Stream".split(""),
        streamMimeTypeSize: 20,
        streamMimeType: "audio/x-pn-realaudio".split(""),
        specificTypeDataSize: 86,
        specificTypeData: [
          46,
          114,
          97,
          253,
          0,
          5,
          0,
          0,
          46,
          114,
          97,
          53,
          129,
          151,
          110,
          148,
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
          175,
          200,
          0,
          172,
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
      },
      {
        type: ["M", "D", "P", "R"],
        size: 116,
        version: 0,
        numberOfStreams: 1,
        maxBitRate: 34000,
        averageBitRate: 34000,
        maxDataPacketSize: 607,
        averageDataPacketSize: 457,
        startOffset: 0,
        preroll: 5069,
        duration: 8500,
        descriptionSize: 12,
        description: "Video Stream".split(""),
        streamMimeTypeSize: 20,
        streamMimeType: "video/x-pn-realvideo".split(""),
        specificTypeDataSize: 38,
        specificTypeData: [
          0,
          0,
          0,
          38,
          86,
          73,
          68,
          79,
          82,
          86,
          51,
          48,
          0,
          168,
          0,
          116,
          0,
          12,
          0,
          0,
          0,
          0,
          0,
          7,
          0,
          0,
          1,
          10,
          144,
          48,
          48,
          32,
          32,
          2,
          180,
          121,
          42,
          29,
        ],
      },
      {
        type: ["M", "D", "P", "R"],
        size: 627,
        version: 0,
        numberOfStreams: 2,
        maxBitRate: 0,
        averageBitRate: 0,
        maxDataPacketSize: 0,
        averageDataPacketSize: 0,
        startOffset: 0,
        preroll: 0,
        duration: 0,
        descriptionSize: 0,
        description: [],
        streamMimeTypeSize: 16,
        streamMimeType: "logical-fileinfo".split(""),
        specificTypeDataSize: 565,
        specificTypeData: [
          0,
          0,
          2,
          53,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          11,
          0,
          0,
          0,
          26,
          0,
          0,
          9,
          73,
          110,
          100,
          101,
          120,
          97,
          98,
          108,
          101,
          0,
          0,
          0,
          0,
          0,
          4,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          50,
          0,
          0,
          16,
          84,
          97,
          114,
          103,
          101,
          116,
          32,
          65,
          117,
          100,
          105,
          101,
          110,
          99,
          101,
          115,
          0,
          0,
          0,
          2,
          0,
          21,
          53,
          54,
          75,
          32,
          77,
          111,
          100,
          101,
          109,
          32,
          40,
          52,
          48,
          32,
          75,
          98,
          112,
          115,
          41,
          59,
          0,
          0,
          0,
          0,
          31,
          0,
          0,
          12,
          65,
          117,
          100,
          105,
          111,
          32,
          70,
          111,
          114,
          109,
          97,
          116,
          0,
          0,
          0,
          2,
          0,
          6,
          77,
          117,
          115,
          105,
          99,
          0,
          0,
          0,
          0,
          46,
          0,
          0,
          13,
          86,
          105,
          100,
          101,
          111,
          32,
          81,
          117,
          97,
          108,
          105,
          116,
          121,
          0,
          0,
          0,
          2,
          0,
          20,
          78,
          111,
          114,
          109,
          97,
          108,
          32,
          77,
          111,
          116,
          105,
          111,
          110,
          32,
          86,
          105,
          100,
          101,
          111,
          0,
          0,
          0,
          0,
          45,
          0,
          0,
          13,
          67,
          114,
          101,
          97,
          116,
          105,
          111,
          110,
          32,
          68,
          97,
          116,
          101,
          0,
          0,
          0,
          2,
          0,
          19,
          56,
          47,
          50,
          56,
          47,
          50,
          48,
          48,
          48,
          32,
          49,
          49,
          58,
          51,
          50,
          58,
          51,
          48,
          0,
          0,
          0,
          0,
          49,
          0,
          0,
          17,
          77,
          111,
          100,
          105,
          102,
          105,
          99,
          97,
          116,
          105,
          111,
          110,
          32,
          68,
          97,
          116,
          101,
          0,
          0,
          0,
          2,
          0,
          19,
          56,
          47,
          50,
          56,
          47,
          50,
          48,
          48,
          48,
          32,
          49,
          49,
          58,
          51,
          50,
          58,
          51,
          48,
          0,
          0,
          0,
          0,
          60,
          0,
          0,
          12,
          71,
          101,
          110,
          101,
          114,
          97,
          116,
          101,
          100,
          32,
          66,
          121,
          0,
          0,
          0,
          2,
          0,
          35,
          82,
          101,
          97,
          108,
          80,
          114,
          111,
          100,
          117,
          99,
          101,
          114,
          32,
          80,
          108,
          117,
          115,
          32,
          56,
          46,
          48,
          46,
          48,
          46,
          52,
          53,
          32,
          87,
          105,
          110,
          100,
          111,
          119,
          115,
          0,
          0,
          0,
          0,
          22,
          0,
          0,
          8,
          75,
          101,
          121,
          119,
          111,
          114,
          100,
          115,
          0,
          0,
          0,
          2,
          0,
          1,
          0,
          0,
          0,
          0,
          22,
          0,
          0,
          8,
          65,
          98,
          115,
          116,
          114,
          97,
          99,
          116,
          0,
          0,
          0,
          2,
          0,
          1,
          0,
          0,
          0,
          0,
          145,
          0,
          0,
          14,
          67,
          111,
          110,
          116,
          101,
          110,
          116,
          32,
          82,
          97,
          116,
          105,
          110,
          103,
          0,
          0,
          0,
          2,
          0,
          118,
          40,
          80,
          73,
          67,
          83,
          45,
          49,
          46,
          49,
          32,
          34,
          104,
          116,
          116,
          112,
          58,
          47,
          47,
          119,
          119,
          119,
          46,
          99,
          108,
          97,
          115,
          115,
          105,
          102,
          121,
          46,
          111,
          114,
          103,
          47,
          115,
          97,
          102,
          101,
          115,
          117,
          114,
          102,
          34,
          32,
          108,
          97,
          98,
          101,
          108,
          115,
          32,
          99,
          111,
          109,
          109,
          101,
          110,
          116,
          32,
          34,
          82,
          101,
          97,
          108,
          80,
          114,
          111,
          100,
          117,
          99,
          101,
          114,
          32,
          80,
          108,
          117,
          115,
          32,
          56,
          46,
          48,
          46,
          48,
          46,
          52,
          53,
          32,
          87,
          105,
          110,
          100,
          111,
          119,
          115,
          34,
          32,
          114,
          97,
          116,
          105,
          110,
          103,
          115,
          32,
          40,
          83,
          83,
          126,
          126,
          48,
          48,
          48,
          32,
          49,
          41,
          41,
          0,
          0,
          0,
          0,
          57,
          0,
          0,
          7,
          70,
          105,
          108,
          101,
          32,
          73,
          68,
          0,
          0,
          0,
          2,
          0,
          37,
          97,
          48,
          97,
          57,
          49,
          100,
          55,
          49,
          45,
          101,
          101,
          49,
          55,
          45,
          101,
          53,
          51,
          101,
          45,
          99,
          100,
          102,
          52,
          45,
          55,
          52,
          51,
          100,
          53,
          56,
          55,
          55,
          55,
          51,
          49,
          101,
          0,
        ],
      },
    ]);
    expect(videoValue.contentDescription).toEqual({
      author: [],
      authorLength: 0,
      comment: [],
      commentLength: 0,
      copyright: ")2000".split(""),
      copyrightLength: 5,
      size: 23,
      title: [],
      titleLength: 0,
      type: "CONT".split(""),
      version: 0,
    });
    expect(videoValue.dataHeader.type).toEqual("DATA".split(""));
    expect(videoValue.dataHeader.size).toBe(57948);
    expect(videoValue.dataHeader.version).toBe(0);
    expect(videoValue.dataHeader.numOfDataPackets).toBe(132);
    expect(videoValue.dataHeader.nextDataOffset).toBe(0);
    expect(videoValue.dataHeader.dataPackets.length).toBe(132);
    expect(videoValue.dataHeader.dataPackets[0].size).toBe(300);
    expect(videoValue.dataHeader.dataPackets[0].streamNumber).toBe(0);
    expect(videoValue.dataHeader.dataPackets[0].timestamp).toBe(0);
    expect(videoValue.dataHeader.dataPackets[0].version).toBe(0);
    expect(videoValue.dataHeader.dataPackets[0].specificData.length).toBe(290);
    expect(videoValue.dataHeader.dataPackets[131].size).toBe(302);
    expect(videoValue.dataHeader.dataPackets[131].streamNumber).toBe(1);
    expect(videoValue.dataHeader.dataPackets[131].timestamp).toBe(8500);
    expect(videoValue.dataHeader.dataPackets[131].version).toBe(0);
    expect(videoValue.dataHeader.dataPackets[131].specificData.length).toBe(292);
    expect(videoValue.indexHeaders).toEqual([
      {
        type: "INDX".split(""),
        version: 0,
        numberOfStreams: 0,
        numberOfEntries: 4,
        size: 76,
        nextIndexOffset: 59022,
        entries: [
          {
            number: 0,
            offset: 1016,
            timestampInMs: 0,
            version: 0,
          },
          {
            number: 42,
            offset: 20986,
            timestampInMs: 2298,
            version: 0,
          },
          {
            number: 70,
            offset: 32484,
            timestampInMs: 4597,
            version: 0,
          },
          {
            number: 101,
            offset: 45403,
            timestampInMs: 6896,
            version: 0,
          },
        ],
      },
      {
        type: "INDX".split(""),
        version: 0,
        numberOfStreams: 1,
        numberOfEntries: 2,
        size: 48,
        nextIndexOffset: 59070,
        entries: [
          {
            number: 6,
            offset: 2816,
            timestampInMs: 1,
            version: 0,
          },
          {
            number: 123,
            offset: 54702,
            timestampInMs: 8075,
            version: 0,
          },
        ],
      },
      {
        type: "INDX".split(""),
        version: 0,
        numberOfStreams: 2,
        numberOfEntries: 0,
        size: 20,
        nextIndexOffset: 0,
        entries: [],
      },
    ]);
  });
});
