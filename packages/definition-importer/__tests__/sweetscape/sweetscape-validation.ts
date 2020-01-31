import { AstValidator, SweetscapeDefinitionImporter } from "../..";
import { AssetLoader } from "../utils/010-structures";

describe("Sweetscape Importer", () => {
  const importer = new SweetscapeDefinitionImporter();
  const loader = new AssetLoader();

  beforeAll(loader.load());

  loader.iterateElements((categoryType, elementName, getter) => {
    test(`returns a valid result for ${categoryType} ${elementName}`, () => {
      const element = getter();
      const definition = importer.readInput(element.content);
      const visitor = new AstValidator();
      expect(() => definition.accept(visitor)).not.toThrow();
    });
  });
});
