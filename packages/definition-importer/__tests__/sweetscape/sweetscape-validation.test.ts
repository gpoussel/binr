import { includes } from "lodash";

import { AstValidator, SWEETSCAPE_FORMAT, SweetscapeDefinitionImporter } from "../..";
import { AssetLoader } from "../utils/010-structures";

const KNOWN_ERRORS: string[] = ["EDID.bt", "ISO.bt", "LuaJIT.bt", "SSP.bt"];

describe("Sweetscape Importer", () => {
  const importer = new SweetscapeDefinitionImporter();
  const loader = new AssetLoader();

  beforeAll(loader.load());

  loader.iterateElements((categoryType, elementName, getter) => {
    test(`returns a valid result for ${categoryType} ${elementName}`, () => {
      const element = getter();
      const definition = importer.readInput(element.content);
      const visitor = new AstValidator(SWEETSCAPE_FORMAT);
      if (includes(KNOWN_ERRORS, elementName)) {
        expect(() => definition.accept(visitor)).toThrow();
      } else {
        expect(() => definition.accept(visitor)).not.toThrow();
      }
    });
  });
});
