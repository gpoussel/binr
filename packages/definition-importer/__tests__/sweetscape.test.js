"use strict";

const _ = require("lodash");
const fs = require("fs");
const tar = require("tar-stream");
const gunzip = require("gunzip-maybe");
const SweetscapeImporter = require("../lib/sweetscape/sweetscape-importer");

const structureFolder = `${__dirname}/../__fixtures__/`;

describe("Sweetscape Importer", () => {
  const importer = new SweetscapeImporter();
  test("reads misc definitions", () => {
    // The file itself is not important and does not represent any structures
    // It is only there to reach a 100% coverage on the structure parser
    // This is definitely useful for regression test during refactoring
    const definitionBuffer = fs.readFileSync(`${structureFolder}/misc-sample.bt`, "UTF-8");
    const definition = importer.readInput(definitionBuffer);
    expect(definition).toBeDefined();
  });

  test("reads all 010 sample structures", done => {
    const readStream = fs.createReadStream(`${structureFolder}/010-structures.tar.gz`);
    const extract = tar.extract();

    extract.on("entry", (header, stream, next) => {
      const chunks = [];
      stream.on("data", chunk => chunks.push(chunk));
      stream.once("end", () => {
        const buffer = _.join(chunks, "");
        try {
          const definition = importer.readInput(buffer);
          expect(definition).toBeDefined();
        } catch (e) {
          e.message = `[${header.name}] ${e.message}`;
          done.fail(e);
        }

        next();
      });
      stream.resume();
    });
    extract.on("finish", () => {
      done();
    });
    readStream.pipe(gunzip()).pipe(extract);
  }, 45000);
});
