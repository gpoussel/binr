import { SweetscapeDefinitionImporter } from "../lib/sweetscape/sweetscape-importer";
import { AssetLoader } from "./utils/010-structures";

describe("Sweetscape Importer", () => {
  const importer = new SweetscapeDefinitionImporter();
  const loader = new AssetLoader();

  beforeAll(loader.load());

  test("creates basic definitions", () => {
    expect(importer.readInput("if (a && b || c || d) { foo(); }")).toMatchSnapshot();
  });

  test("creates misc definitions", () => {
    // The file itself is not important and does not represent any structures
    // It is only there to reach a 100% coverage on the structure parser
    // This is definitely useful for regression test during refactoring
    const definition = importer.readInput(loader.getSingleStructure("misc-sample"));
    expect(definition).toBeDefined();
  });

  loader.iterateElements((categoryType, elementName, getter) => {
    test(`creates ${categoryType} ${elementName}`, () => {
      const element = getter();
      const definition = importer.readInput(element.content);
      expect(definition).toBeDefined();
      expect(definition).toMatchSnapshot();
    });
  });
});
