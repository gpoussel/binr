import { each, find } from "lodash";

import { SweetscapeDefinitionImporter } from "../lib/sweetscape/sweetscape-importer";
import { SCRIPT_NAMES, STRUCTURE_NAMES, getArchiveEntries, getSingleStructure } from "./utils/010-structures";

describe("Sweetscape Importer", () => {
  const importer = new SweetscapeDefinitionImporter();
  let scripts: any[] = [];
  let structures: any[] = [];

  beforeAll(async (done) => {
    scripts = await getArchiveEntries("010-scripts.tar.gz");
    structures = await getArchiveEntries("010-structures.tar.gz");
    done();
  });

  test("creates basic definitions", () => {
    expect(importer.readInput("if (a && b || c || d) { foo(); }")).toMatchSnapshot();
  });

  test("creates misc definitions", () => {
    // The file itself is not important and does not represent any structures
    // It is only there to reach a 100% coverage on the structure parser
    // This is definitely useful for regression test during refactoring
    const definition = importer.readInput(getSingleStructure("misc-sample"));
    expect(definition).toBeDefined();
  });

  each(
    [
      { type: "script", names: SCRIPT_NAMES, load: () => scripts },
      { type: "structure", names: STRUCTURE_NAMES, load: () => structures },
    ],
    (category) => {
      each(category.names, (elementName) => {
        test(`creates ${category.type} ${elementName}`, () => {
          const element = find(category.load(), (e) => e.name === elementName);
          expect(element).toBeDefined();

          const definition = importer.readInput(element.content);
          expect(definition).toBeDefined();
          expect(definition).toMatchSnapshot();
        });
      });
    },
  );
});
