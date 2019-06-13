const fs = require("fs");
const _ = require("lodash");
const tar = require("tar-stream");
const gunzip = require("gunzip-maybe");

const structureFolder = `${__dirname}/../../__fixtures__/`;

function getSingleStructure(name) {
  return fs.readFileSync(`${structureFolder}/${name}.bt`, "UTF-8");
}

function iterateStructures(iteratee, done) {
  const readStream = fs.createReadStream(`${structureFolder}/010-structures.tar.gz`);
  const extract = tar.extract();

  extract.on("entry", (header, stream, next) => {
    const chunks = [];
    stream.on("data", chunk => chunks.push(chunk));
    stream.once("end", () => {
      const buffer = _.join(chunks, "");
      iteratee(header.name, buffer);
      next();
    });
    stream.resume();
  });
  extract.on("finish", () => {
    done();
  });
  readStream.pipe(gunzip()).pipe(extract);
}

module.exports = { getSingleStructure, iterateStructures };
