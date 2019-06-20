const fs = require("fs");
const _ = require("lodash");
const tar = require("tar-stream");
const gunzip = require("gunzip-maybe");

const structureFolder = `${__dirname}/../../__fixtures__/`;

function getSingleStructure(name) {
  return fs.readFileSync(`${structureFolder}/${name}.bt`, "UTF-8");
}

function iterateArchive(filename, iteratee, done, filter) {
  const readStream = fs.createReadStream(`${structureFolder}/${filename}`);
  const extract = tar.extract();

  extract.on("entry", (header, stream, next) => {
    const chunks = [];
    stream.on("data", chunk => chunks.push(chunk));
    stream.once("end", () => {
      const buffer = _.join(chunks, "");
      if (_.isUndefined(filter) || filter(header.name)) {
        iteratee(header.name, buffer);
      }
      next();
    });
    stream.resume();
  });
  extract.on("finish", () => {
    done();
  });
  readStream.pipe(gunzip()).pipe(extract);
}

function iterateStructures(iteratee, done, filter) {
  return iterateArchive("010-structures.tar.gz", iteratee, done, filter);
}

function iterateScripts(iteratee, done, filter) {
  return iterateArchive("010-scripts.tar.gz", iteratee, done, filter);
}

module.exports = { getSingleStructure, iterateStructures, iterateScripts };
