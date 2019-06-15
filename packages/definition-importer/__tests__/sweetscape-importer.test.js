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
            array: false,
          },
          alias: "ULONGLONG",
          annotations: [],
        });

        const structDeclaration = content[1];
        expect(structDeclaration).toEqual({
          type: "structDeclaration",
          name: {
            name: "IMAGE_DOS_HEADER",
            annotations: [],
          },
          declaration: {
            body: {
              type: "statementList",
              statements: [
                {
                  type: "variableDeclaration",
                  variableType: { name: "WORD", array: false },
                  declarations: [
                    {
                      annotations: [
                        { key: "comment", value: "IMAGE_DOS_SIGNATURE = 0x5A4D" },
                        { key: "format", value: "hex" },
                      ],
                      name: "MZSignature",
                    },
                  ],
                  annotations: [],
                },
                {
                  type: "variableDeclaration",
                  variableType: { name: "WORD", array: false },
                  declarations: [
                    {
                      annotations: [{ key: "comment", value: "Bytes on last page of file" }],
                      name: "UsedBytesInTheLastPage",
                    },
                  ],
                  annotations: [],
                },
                {
                  type: "variableDeclaration",
                  variableType: { name: "WORD", array: false },
                  declarations: [
                    { annotations: [{ key: "comment", value: "Pages in file" }], name: "FileSizeInPages" },
                  ],
                  annotations: [],
                },
                {
                  type: "variableDeclaration",
                  variableType: { name: "WORD", array: false },
                  declarations: [
                    {
                      annotations: [{ key: "comment", value: "Relocations" }],
                      name: "NumberOfRelocationItems",
                    },
                  ],
                  annotations: [],
                },
                {
                  type: "variableDeclaration",
                  variableType: { name: "WORD", array: false },
                  declarations: [
                    {
                      annotations: [{ key: "comment", value: "Size of header in paragraphs" }],
                      name: "HeaderSizeInParagraphs",
                    },
                  ],
                  annotations: [],
                },
                {
                  type: "variableDeclaration",
                  variableType: { name: "WORD", array: false },
                  declarations: [
                    {
                      annotations: [{ key: "comment", value: "Minimum extra paragraphs needed" }],
                      name: "MinimumExtraParagraphs",
                    },
                  ],
                  annotations: [],
                },
                {
                  type: "variableDeclaration",
                  variableType: { name: "WORD", array: false },
                  declarations: [
                    {
                      annotations: [{ key: "comment", value: "Maximum extra paragraphs needed" }],
                      name: "MaximumExtraParagraphs",
                    },
                  ],
                  annotations: [],
                },
                {
                  type: "variableDeclaration",
                  variableType: { name: "WORD", array: false },
                  declarations: [
                    {
                      annotations: [{ key: "comment", value: "Initial (relative) SS value" }],
                      name: "InitialRelativeSS",
                    },
                  ],
                  annotations: [],
                },
                {
                  type: "variableDeclaration",
                  variableType: { name: "WORD", array: false },
                  declarations: [
                    { annotations: [{ key: "comment", value: "Initial SP value" }], name: "InitialSP" },
                  ],
                  annotations: [],
                },
                {
                  type: "variableDeclaration",
                  variableType: { name: "WORD", array: false },
                  declarations: [{ annotations: [{ key: "comment", value: "Checksum" }], name: "Checksum" }],
                  annotations: [],
                },
                {
                  type: "variableDeclaration",
                  variableType: { name: "WORD", array: false },
                  declarations: [
                    { annotations: [{ key: "comment", value: "Initial IP value" }], name: "InitialIP" },
                  ],
                  annotations: [],
                },
                {
                  type: "variableDeclaration",
                  variableType: { name: "WORD", array: false },
                  declarations: [
                    {
                      annotations: [{ key: "comment", value: "Initial (relative) CS value" }],
                      name: "InitialRelativeCS",
                    },
                  ],
                  annotations: [],
                },
                {
                  type: "variableDeclaration",
                  variableType: { name: "WORD", array: false },
                  declarations: [
                    {
                      annotations: [{ key: "comment", value: "File address of relocation table" }],
                      name: "AddressOfRelocationTable",
                    },
                  ],
                  annotations: [],
                },
                {
                  type: "variableDeclaration",
                  variableType: { name: "WORD", array: false },
                  declarations: [
                    { annotations: [{ key: "comment", value: "Overlay number" }], name: "OverlayNumber" },
                  ],
                  annotations: [],
                },
                {
                  type: "variableDeclaration",
                  variableType: { name: "WORD", array: false },
                  declarations: [
                    {
                      arraySelector: {
                        type: "primaryExpression",
                        expression: { type: "number", value: 4 },
                      },
                      annotations: [{ key: "comment", value: "Reserved words" }],
                      name: "Reserved",
                    },
                  ],
                  annotations: [],
                },
                {
                  type: "variableDeclaration",
                  variableType: { name: "WORD", array: false },
                  declarations: [
                    {
                      annotations: [{ key: "comment", value: "OEM identifier (for OEMinfo)" }],
                      name: "OEMid",
                    },
                  ],
                  annotations: [],
                },
                {
                  type: "variableDeclaration",
                  variableType: { name: "WORD", array: false },
                  declarations: [
                    {
                      annotations: [{ key: "comment", value: "OEM information; OEMid specific" }],
                      name: "OEMinfo",
                    },
                  ],
                  annotations: [],
                },
                {
                  type: "variableDeclaration",
                  variableType: { name: "WORD", array: false },
                  declarations: [
                    {
                      arraySelector: {
                        type: "primaryExpression",
                        expression: { type: "number", value: 10 },
                      },
                      annotations: [{ key: "comment", value: "Reserved words" }],
                      name: "Reserved2",
                    },
                  ],
                  annotations: [],
                },
                {
                  type: "variableDeclaration",
                  variableType: { name: "LONG", array: false },
                  declarations: [
                    {
                      annotations: [
                        { key: "comment", value: "NtHeader Offset" },
                        { key: "format", value: "hex" },
                      ],
                      name: "AddressOfNewExeHeader",
                    },
                  ],
                  annotations: [],
                },
              ],
            },
          },
        });

        const enumDeclaration = content[3];
        expect(enumDeclaration).toEqual({
          type: "enumDeclaration",
          baseType: {
            name: "WORD",
            array: false,
          },
          declarations: [
            {
              name: "IMAGE_MACHINE_UNKNOWN",
              value: { type: "primaryExpression", expression: { type: "number", value: 0 } },
            },
            {
              name: "I386",
              value: { type: "primaryExpression", expression: { type: "number", value: 0x014c } },
            },
            {
              name: "R3000",
              value: { type: "primaryExpression", expression: { type: "number", value: 0x0162 } },
            },
            {
              name: "R4000",
              value: { type: "primaryExpression", expression: { type: "number", value: 0x0166 } },
            },
            {
              name: "R10000",
              value: { type: "primaryExpression", expression: { type: "number", value: 0x0168 } },
            },
            {
              name: "WCEMIPSV2",
              value: { type: "primaryExpression", expression: { type: "number", value: 0x0169 } },
            },
            {
              name: "ALPHA",
              value: { type: "primaryExpression", expression: { type: "number", value: 0x0184 } },
            },
            {
              name: "SH3",
              value: { type: "primaryExpression", expression: { type: "number", value: 0x01a2 } },
            },
            {
              name: "SH3DSP",
              value: { type: "primaryExpression", expression: { type: "number", value: 0x01a3 } },
            },
            {
              name: "SH3E",
              value: { type: "primaryExpression", expression: { type: "number", value: 0x01a4 } },
            },
            {
              name: "SH4",
              value: { type: "primaryExpression", expression: { type: "number", value: 0x01a6 } },
            },
            {
              name: "SH5",
              value: { type: "primaryExpression", expression: { type: "number", value: 0x01a8 } },
            },
            {
              name: "ARM",
              value: { type: "primaryExpression", expression: { type: "number", value: 0x01c0 } },
            },
            {
              name: "THUMB",
              value: { type: "primaryExpression", expression: { type: "number", value: 0x01c2 } },
            },
            {
              name: "AM33",
              value: { type: "primaryExpression", expression: { type: "number", value: 0x01d3 } },
            },
            {
              name: "POWERPC",
              value: { type: "primaryExpression", expression: { type: "number", value: 0x01f0 } },
            },
            {
              name: "POWERPCFP",
              value: { type: "primaryExpression", expression: { type: "number", value: 0x01f1 } },
            },
            {
              name: "IA64",
              value: { type: "primaryExpression", expression: { type: "number", value: 0x0200 } },
            },
            {
              name: "MIPS16",
              value: { type: "primaryExpression", expression: { type: "number", value: 0x0266 } },
            },
            {
              name: "ALPHA64",
              value: { type: "primaryExpression", expression: { type: "number", value: 0x0284 } },
            },
            {
              name: "MIPSFPU",
              value: { type: "primaryExpression", expression: { type: "number", value: 0x0366 } },
            },
            {
              name: "MIPSFPU16",
              value: { type: "primaryExpression", expression: { type: "number", value: 0x0466 } },
            },
            {
              name: "TRICORE",
              value: { type: "primaryExpression", expression: { type: "number", value: 0x0520 } },
            },
            {
              name: "CEF",
              value: { type: "primaryExpression", expression: { type: "number", value: 0x0cef } },
            },
            {
              name: "EBC",
              value: { type: "primaryExpression", expression: { type: "number", value: 0x0ebc } },
            },
            {
              name: "AMD64",
              value: { type: "primaryExpression", expression: { type: "number", value: 0x8664 } },
            },
            {
              name: "M32R",
              value: { type: "primaryExpression", expression: { type: "number", value: 0x9041 } },
            },
            {
              name: "CEE",
              value: { type: "primaryExpression", expression: { type: "number", value: 0xc0ee } },
            },
          ],
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
            type: "binaryExpression",
            operator: ">",
            left: {
              type: "binaryExpression",
              operator: "-",
              left: {
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
              right: {
                type: "primaryExpression",
                expression: {
                  type: "identifier",
                  name: "ulRawHeaderSize",
                },
              },
            },
            right: {
              type: "primaryExpression",
              expression: {
                type: "number",
                value: 0,
              },
            },
          },
          trueStatement: {
            type: "statementList",
            statements: [
              {
                type: "variableDeclaration",
                variableType: {
                  array: false,
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
                      type: "binaryExpression",
                      operator: "-",
                      left: {
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
                      right: {
                        type: "primaryExpression",
                        expression: {
                          type: "identifier",
                          name: "ulRawHeaderSize",
                        },
                      },
                    },
                  },
                ],
                annotations: [],
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
