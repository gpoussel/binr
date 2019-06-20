import fs from "fs";
import gunzip from "gunzip-maybe";
import _ from "lodash";
import tar from "tar-stream";

const structureFolder = `${__dirname}/../../__fixtures__/`;

export function getSingleStructure(name) {
  return fs.readFileSync(`${structureFolder}/${name}.bt`, "UTF-8");
}

export function iterateArchive(filename, iteratee, done, filter) {
  const readStream = fs.createReadStream(`${structureFolder}/${filename}`);
  const extract = tar.extract();

  extract.on("entry", (header, stream, next) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
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

export function iterateStructures(iteratee, done, filter) {
  return iterateArchive("010-structures.tar.gz", iteratee, done, filter);
}

export function iterateScripts(iteratee, done, filter) {
  return iterateArchive("010-scripts.tar.gz", iteratee, done, filter);
}
