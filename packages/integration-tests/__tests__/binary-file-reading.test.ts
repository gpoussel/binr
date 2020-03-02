import * as fs from "fs";

import { EvaluationContext } from "@binr/ast";
import { BinrDefinitionImporter } from "@binr/definition-importer";
import { each } from "lodash";

import { TestEvaluationInput } from "./test-evaluation-input";

const pathToDefinitionFixtures = `${__dirname}/../__fixtures__/definitions`;

const FILE_TYPES = [
  { type: "AVI", definitionFilename: "avi.binr", binaryFilename: "MVI_3572.avi" },
  { type: "EOT", definitionFilename: "eot.binr", binaryFilename: "roboto-regular-webfont.eot" },
  { type: "GIF", definitionFilename: "gif.binr", binaryFilename: "tree.gif" },
  { type: "ICO", definitionFilename: "ico.binr", binaryFilename: "bing.ico" },
  { type: "Java Class", definitionFilename: "java_class.binr", binaryFilename: "CucumberModules.class" },
  { type: "Android Manifest", definitionFilename: "manifest.binr", binaryFilename: "AndroidManifest.xml" },
  { type: "RAR", definitionFilename: "rar.binr", binaryFilename: "sample.rar" },
  { type: "RM video", definitionFilename: "rm.binr", binaryFilename: "video.rm" },
  { type: "ROMFS", definitionFilename: "romfs.binr", binaryFilename: "sample.romfs" },
  { type: "SHX", definitionFilename: "shx.binr", binaryFilename: "us_ski_areas.shx" },
  { type: "torrent", definitionFilename: "torrent.binr", binaryFilename: "ubuntu.torrent" },
  { type: "WMF", definitionFilename: "wmf.binr", binaryFilename: "sample.wmf" },
];

describe("Binary file reading", () => {
  const definitionReader = new BinrDefinitionImporter();

  each(FILE_TYPES, ({ type, definitionFilename, binaryFilename }) => {
    test(`reads ${type} file (${binaryFilename})`, () => {
      const definitionFile = fs.readFileSync(`${pathToDefinitionFixtures}/${definitionFilename}`);
      const definition = definitionReader.readInput(definitionFile.toString());

      const result = definition.evaluate(new EvaluationContext(), new TestEvaluationInput(binaryFilename));
      expect(result).toBeDefined();
      expect(result).toMatchSnapshot();
    });
  });
});
