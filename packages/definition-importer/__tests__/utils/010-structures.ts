import * as fs from "fs";
// @ts-ignore
import * as gunzip from "gunzip-maybe";
import { join } from "lodash";
import * as tar from "tar-stream";

const structureFolder = `${__dirname}/../../__fixtures__/`;

export function getSingleStructure(name: string) {
  return fs.readFileSync(`${structureFolder}/${name}.bt`, "UTF-8");
}

export async function getArchiveEntries(filename: string) {
  const readStream = fs.createReadStream(`${structureFolder}/${filename}`);
  return new Promise<any[]>((resolve) => {
    const extract = tar.extract();
    const entries: any[] = [];
    extract.on("entry", (header, stream, next) => {
      const chunks: string[] = [];
      stream.on("data", (chunk) => chunks.push(chunk));
      stream.once("end", () => {
        const buffer = join(chunks, "");
        entries.push({
          name: header.name,
          content: buffer,
        });
        next();
      });
      stream.resume();
    });
    extract.on("finish", () => {
      resolve(entries);
    });
    readStream.pipe(gunzip()).pipe(extract);
  });
}
