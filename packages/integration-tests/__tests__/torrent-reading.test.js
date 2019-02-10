"use strict";

const fs = require("fs");
const { BinaryReader } = require("@binr/binary-reader");
const { DefinitionReader } = require("@binr/definition-reader");

const pathToBinaryFixtures = `${__dirname}/../__fixtures__/binaries`;
const pathToDefinitionFixtures = `${__dirname}/../__fixtures__/definitions`;

describe("TORRENT reading", () => {
  const definitionReader = new DefinitionReader();

  const torrentDefinitionFile = fs.readFileSync(`${pathToDefinitionFixtures}/torrent.binr`);
  const torrentDefinition = definitionReader.readInput(torrentDefinitionFile.toString());

  const torrentFile = `${pathToBinaryFixtures}/ubuntu.torrent`;
  const torrentBuffer = fs.readFileSync(torrentFile);

  test("reads TORRENT file", () => {
    const binaryReader = new BinaryReader();
    const torrentValue = binaryReader.read(torrentBuffer, torrentDefinition, "TorrentFile");
    expect(torrentValue).toBeDefined();
    expect(torrentValue.identifier).toBe("d");
  });
});
