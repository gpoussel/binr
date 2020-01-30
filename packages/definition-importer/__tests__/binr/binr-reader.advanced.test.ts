import * as fs from "fs";

import { each } from "lodash";

import { BinrDefinitionImporter } from "../../lib/binr/binr-definition-importer";

const pathToFixtures = `${__dirname}/../../__fixtures__/`;

describe("BinrDefinitionImporter, advanced", () => {
  // Note: these definitions are not complete at all. They are often inspired by
  // a real-world format but they are never fully implemented.
  test("parses example format definition", () => {
    each(["bmp.binr", "mft.binr"], (filename) => {
      const structure = fs.readFileSync(`${pathToFixtures}/${filename}`, "utf-8");
      const importer = new BinrDefinitionImporter();
      const definition = importer.readInput(structure);
      expect(definition).toBeDefined();
    });
  });
});
