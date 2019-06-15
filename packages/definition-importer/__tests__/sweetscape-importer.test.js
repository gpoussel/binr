"use strict";

const _ = require("lodash");
const SweetscapeImporter = require("../lib/sweetscape/sweetscape-importer");
const { iterateStructures } = require("./utils/010-structures");

describe("Sweetscape Importer", () => {
  const importer = new SweetscapeImporter();

  test("creates EXE definition", done => {
    iterateStructures(
      (name, input) => {
        const definition = importer.readInput(input);
        expect(definition).toBeDefined();
        expect(definition.type).toEqual("definition");
        const { content } = definition;

        expect(content).toHaveLength(93);

        const typedefNode = content[0];
        expect(typedefNode).toEqual({
          type: "typeAlias",
          name: {
            name: "QWORD",
            array: false, // TODO That's wrong
          },
          alias: "ULONGLONG",
          annotations: [],
        });

        const structDeclaration = content[1];
        expect(structDeclaration).toEqual({
          type: "structDeclaration",
          name: {
            // TODO Weird?
            name: "IMAGE_DOS_HEADER",
            annotations: [],
          },
          declaration: undefined, // TODO Obviously wrong
        });

        const functionDeclaration = content[64];
        expect(functionDeclaration).toEqual({
          type: "functionDeclaration",
          forwardDeclaration: false,
          name: "CommentBaseRelocationTable",
          parameters: [
            {
              type: {
                name: "BASE_RELOCATION_TABLE",
                array: false,
              },
              name: "RelocTable",
              reference: true,
            },
          ],
          returnType: {
            name: "string",
            array: false,
          },
          content: {
            type: "statementList",
            statements: [
              {
                type: "variableDeclaration",
                local: true,
                variableType: {
                  name: "string",
                  array: false,
                },
                declarations: [
                  {
                    name: "sComment",
                    annotations: [],
                  },
                ],
                annotations: [],
              },
              {
                type: "primaryExpression",
                expression: {
                  type: "functionCall",
                  name: "SPrintf",
                  arguments: [
                    {
                      type: "primaryExpression",
                      expression: {
                        type: "identifier",
                        name: "sComment",
                      },
                    },
                    {
                      type: "primaryExpression",
                      expression: {
                        type: "stringLiteral",
                        string: "%d",
                      },
                    },
                    {
                      type: "qualifiedExpression",
                      expression: {
                        type: "identifier",
                        name: "RelocTable",
                      },
                      selectors: [{ name: "ulRelocNum", type: "qualifiedSelector" }],
                    },
                  ],
                },
              },
              {
                type: "returnStatement",
                expression: {
                  type: "primaryExpression",
                  expression: {
                    type: "identifier",
                    name: "sComment",
                  },
                },
              },
            ],
          },
        });

        const localVarDeclaration = content[75];
        expect(localVarDeclaration).toEqual({
          type: "variableDeclaration",
          local: true,
          variableType: {
            name: "ULONG",
            array: false,
          },
          declarations: [
            {
              name: "ulRawHeaderSize",
              annotations: [],
            },
          ],
          annotations: [],
        });

        const ifStatement = content[76];
        expect(ifStatement).toEqual({
          type: "ifStatement",
          condition: {
            type: "qualifiedExpression",
            selectors: [
              { name: "OptionalHeader", type: "qualifiedSelector" },
              { name: "SizeOfHeaders", type: "qualifiedSelector" },
            ],
            expression: {
              name: "NtHeader",
              type: "identifier",
            },
          },
          trueStatement: {
            type: "statementList",
            statements: [
              {
                type: "variableDeclaration",
                variableType: {
                  array: false, // TODO That's wrong
                  name: "UCHAR",
                },
                declarations: [
                  {
                    name: "Space2",
                    annotations: [
                      { key: "hidden", value: "true" },
                      { key: "fgcolor", value: "cRed" },
                      { key: "comment", value: "Space between header and first section" },
                    ],
                    arraySelector: {
                      type: "qualifiedExpression",
                      expression: {
                        type: "identifier",
                        name: "NtHeader",
                      },
                      selectors: [
                        { name: "OptionalHeader", type: "qualifiedSelector" },
                        { name: "SizeOfHeaders", type: "qualifiedSelector" },
                      ],
                    },
                  },
                ],
                annotations: [],
                // TODO Missing comments
              },
            ],
          },
        });

        const printfSizeofFunctionCall = content[77];
        expect(printfSizeofFunctionCall).toEqual({
          type: "primaryExpression",
          expression: {
            type: "functionCall",
            name: "Printf",
            arguments: [
              {
                type: "primaryExpression",
                expression: {
                  type: "stringLiteral",
                  string: "Space between headers and first sections is %d bytes\\n",
                },
              },
              {
                type: "sizeofExpression",
                expression: {
                  type: "primaryExpression",
                  expression: {
                    name: "Space2",
                    type: "identifier",
                  },
                },
              },
            ],
          },
        });

        const fseekFunctionCall = content[78];
        expect(fseekFunctionCall).toEqual({
          type: "primaryExpression",
          expression: {
            type: "functionCall",
            name: "FSeek",
            arguments: [
              {
                type: "qualifiedExpression",
                expression: {
                  type: "identifier",
                  name: "NtHeader",
                },
                selectors: [
                  { name: "OptionalHeader", type: "qualifiedSelector" },
                  { name: "SizeOfHeaders", type: "qualifiedSelector" },
                ],
              },
            ],
          },
        });

        const simpleFunctionCall = content[91];
        expect(simpleFunctionCall).toEqual({
          type: "primaryExpression",
          expression: {
            type: "functionCall",
            name: "ParseDelayImport",
            arguments: [],
          },
        });

        const lastPrintfNode = content[92];
        expect(lastPrintfNode).toEqual({
          type: "primaryExpression",
          expression: {
            type: "functionCall",
            name: "Printf",
            arguments: [
              {
                type: "primaryExpression",
                expression: {
                  type: "stringLiteral",
                  string: "EXE.bt finished\\n",
                },
              },
            ],
          },
        });
      },
      done,
      name => name === "EXE.bt"
    );
  });
});
