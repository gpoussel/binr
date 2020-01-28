import { SweetscapeDefinitionImporter } from "../lib/sweetscape/sweetscape-importer";
import {
  getSingleStructure,
  getSingleStructureInArchive,
  iterateScripts,
  iterateStructures,
} from "./utils/010-structures";

describe("Sweetscape Importer", () => {
  const importer = new SweetscapeDefinitionImporter();

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

  test("creates all 010 sample structures", (done) => {
    // We are keeping the state right there, so we can stop the iteration
    // as soon as we got a failure
    let hasFailed = false;
    iterateStructures(
      (name: string, input: string) => {
        try {
          const definition = importer.readInput(input);
          expect(definition).toBeDefined();
          expect(definition).toMatchSnapshot(name);
        } catch (e) {
          e.message = `[${name}] ${e.message}`;
          done.fail(e);
          hasFailed = true;
        }
      },
      done,
      () => !hasFailed,
    );
  }, 45000);

  test("creates all 010 sample scripts", (done) => {
    // We are keeping the state right there, so we can stop the iteration
    // as soon as we got a failure
    let hasFailed = false;
    iterateScripts(
      (name: string, input: string) => {
        if (name === "CountBlocks.1sc") {
          // For an unknown reason, this script contains a typo (line 127), so we can't parse it
          return;
        }
        try {
          const definition = importer.readInput(input);
          expect(definition).toBeDefined();
          expect(definition).toMatchSnapshot(name);
        } catch (e) {
          e.message = `[${name}] ${e.message}`;
          done.fail(e);
          hasFailed = true;
        }
      },
      done,
      () => !hasFailed,
    );
  }, 45000);

  /**
   * This test exists because the EXE.bt contains many different elements.
   */
  test("creates EXE definition", (done) => {
    getSingleStructureInArchive(
      "EXE.bt",
      (input) => {
        const definition = importer.readInput(input);
        expect(definition).toBeDefined();
        expect(definition.type).toEqual("definition");

        const { content } = definition;
        expect(content).toHaveLength(93);
        expect(content).toMatchSnapshot();
      },
      done,
    );
  });

  /**
   * This test exists because the DEX.bt contains many different elements.
   */
  test("creates DEX definition", (done) => {
    getSingleStructureInArchive(
      "DEX.bt",
      (input) => {
        const definition = importer.readInput(input);
        expect(definition).toBeDefined();
        expect(definition.type).toEqual("definition");

        const { content } = definition;
        expect(content).toHaveLength(155);
        expect(content).toMatchSnapshot();
      },
      done,
    );
  });

  /**
   * This test exists for completeness (annotations on typedef statement)
   */
  test("creates DDS definition", (done) => {
    getSingleStructureInArchive(
      "DDS.bt",
      (input) => {
        const definition = importer.readInput(input);
        expect(definition).toBeDefined();
        expect(definition.type).toEqual("definition");

        const { content } = definition;
        expect(content).toHaveLength(14);
        expect(content).toMatchSnapshot();
      },
      done,
    );
  });

  /**
   * This test exists for completeness (empty statement, with a single semi-colon)
   */
  test("creates CAP definition", (done) => {
    getSingleStructureInArchive(
      "CAP.bt",
      (input) => {
        const definition = importer.readInput(input);
        expect(definition).toBeDefined();
        expect(definition.type).toEqual("definition");

        const { content } = definition;
        expect(content).toHaveLength(81);
        expect(content).toMatchSnapshot();
      },
      done,
    );
  });

  /**
   * This test exists for completeness (const variable)
   */
  test("creates 010 definition", (done) => {
    getSingleStructureInArchive(
      "010.bt",
      (input) => {
        const definition = importer.readInput(input);
        expect(definition).toBeDefined();
        expect(definition.type).toEqual("definition");

        const { content } = definition;
        expect(content).toHaveLength(13);
        expect(content).toMatchSnapshot();
      },
      done,
    );
  });
});
