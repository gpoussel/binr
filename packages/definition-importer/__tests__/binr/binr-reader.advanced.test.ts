import * as fs from "fs";

import { BaseAstVisitor } from "@binr/ast";
import { each } from "lodash";

import { BinrDefinitionImporter } from "../../lib/binr/binr-definition-importer";

const pathToFixtures = `${__dirname}/../../__fixtures__/binr`;

describe("BinrDefinitionImporter, advanced", () => {
  // Note: these definitions are not complete at all. They are often inspired by
  // a real-world format but they are never fully implemented.
  each(
    [
      "avi",
      "bmp",
      "eot",
      "gif",
      "ico",
      "java_class",
      "manifest",
      "mft",
      "rar",
      "rm",
      "romfs",
      "shx",
      "torrent",
      "wmf",
    ],
    (filename) => {
      test(`parses example format definition (${filename}.binr)`, () => {
        const structure = fs.readFileSync(`${pathToFixtures}/${filename}.binr`, "utf-8");
        const importer = new BinrDefinitionImporter();
        const definition = importer.readInput(structure);
        expect(definition).toBeDefined();
        expect(definition).toMatchSnapshot();

        // Use a visitor to improve test coverage
        definition.accept(new BaseAstVisitor());
      });
    },
  );
});
