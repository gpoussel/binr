import * as fs from "fs";
// @ts-ignore
import * as gunzip from "gunzip-maybe";
import { isUndefined, join } from "lodash";
import * as tar from "tar-stream";

const structureFolder = `${__dirname}/../../__fixtures__/`;

export function getSingleStructure(name: string) {
  return fs.readFileSync(`${structureFolder}/${name}.bt`, "UTF-8");
}

export function iterateArchive(
  filename: string,
  iteratee: (name: string, buffer: string) => void,
  done: () => void,
  filter: (name: string) => boolean,
) {
  const readStream = fs.createReadStream(`${structureFolder}/${filename}`);
  const extract = tar.extract();

  extract.on("entry", (header, stream, next) => {
    const chunks: string[] = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.once("end", () => {
      const buffer = join(chunks, "");
      if (isUndefined(filter) || filter(header.name)) {
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

export function iterateStructures(
  iteratee: (name: string, buffer: string) => void,
  done: () => void,
  filter: (name: string) => boolean,
) {
  return iterateArchive("010-structures.tar.gz", iteratee, done, filter);
}

export function getSingleStructureInArchive(
  name: string,
  iteratee: (input: string) => void,
  done: () => void,
) {
  return iterateStructures(
    (_name: string, buffer: string) => iteratee(buffer),
    done,
    (structureName) => structureName === name,
  );
}

export function iterateScripts(
  iteratee: (name: string, buffer: string) => void,
  done: () => void,
  filter: (name: string) => boolean,
) {
  return iterateArchive("010-scripts.tar.gz", iteratee, done, filter);
}
