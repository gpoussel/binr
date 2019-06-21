import { Importer } from "../lib/importer";

/**
 * This test only exists to reach a maximum line coverage on the code.
 * It mostly checks that any bad implementation of the Importer class
 * will raise exceptions.
 */
describe("Default Importer", () => {
  test("rejects non-string input", () => {
    const importer = new Importer();
    expect(() => importer.readInput(1)).toThrow(/string/);
  });

  test("rejects invalid pre-processor", () => {
    const importer = new Importer();
    importer.performPreprocessing = () => 4;
    expect(() => importer.readInput("")).toThrow(/string/);
  });

  test("check every unimplemented methods", () => {
    const importer = new Importer();
    expect(() => importer.readInput("")).toThrow(/lexer/i);
    importer.getLexer = () => ({
      tokenize: () => [],
    });
    expect(() => importer.readInput("")).toThrow(/parser/i);
    importer.getParser = () => ({
      definition: () => ({}),
    });
    expect(() => importer.readInput("")).toThrow(/visitor/i);
    importer.getVisitor = () => ({
      visit: () => ({}),
    });
    expect(() => importer.readInput("")).toThrow(/build/i);
    importer.build = (input) => input;
    expect(importer.readInput("")).toEqual({});
  });

  test("check lexer errors", () => {
    const importer = new Importer();
    importer.getLexer = () => ({
      tokenize: () => ({
        errors: [
          {
            message: "test error",
          },
        ],
      }),
    });
    importer.getParser = () => ({
      definition: () => ({}),
    });
    importer.getVisitor = () => ({
      visit: () => ({}),
    });
    importer.build = (input) => input;
    expect(() => importer.readInput("")).toThrow(/test error/i);
  });

  test("check parser errors", () => {
    const importer = new Importer();
    importer.getLexer = () => ({
      tokenize: () => [],
    });
    importer.getParser = () => ({
      definition: () => ({}),
      errors: [
        {
          token: {
            startLine: 1,
            startColumn: 1,
            image: "foo",
          },
          name: "ParserError",
          message: "test error",
        },
      ],
    });
    expect(() => importer.readInput("")).toThrow(/test error/i);
  });
});
