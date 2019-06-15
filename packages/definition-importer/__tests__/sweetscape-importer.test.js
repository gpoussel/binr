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
          name: "IMAGE_DOS_HEADER",
          annotations: [],
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

        const structWithBitsetDeclaration = content[4];
        expect(structWithBitsetDeclaration).toEqual({
          type: "structDeclaration",
          declaration: {
            body: {
              type: "statementList",
              statements: [
                {
                  type: "variableDeclaration",
                  variableType: { array: false, name: "WORD" },
                  annotations: [],
                  declarations: [
                    {
                      annotations: [{ key: "comment", value: "0x0001  Relocation info stripped from file" }],
                      name: "IMAGE_FILE_RELOCS_STRIPPED",
                      bits: 1,
                    },
                  ],
                },
                {
                  type: "variableDeclaration",
                  variableType: { array: false, name: "WORD" },
                  annotations: [],
                  declarations: [
                    {
                      annotations: [{ key: "comment", value: "0x0002  File is executable" }],
                      name: "IMAGE_FILE_EXECUTABLE_IMAGE",
                      bits: 1,
                    },
                  ],
                },
                {
                  type: "variableDeclaration",
                  variableType: { array: false, name: "WORD" },
                  annotations: [],
                  declarations: [
                    {
                      annotations: [{ key: "comment", value: "0x0004  Line nunbers stripped from file" }],
                      name: "IMAGE_FILE_LINE_NUMS_STRIPPED",
                      bits: 1,
                    },
                  ],
                },
                {
                  type: "variableDeclaration",
                  variableType: { array: false, name: "WORD" },
                  annotations: [],
                  declarations: [
                    {
                      annotations: [{ key: "comment", value: "0x0008  Local symbols stripped from file" }],
                      name: "IMAGE_FILE_LOCAL_SYMS_STRIPPED",
                      bits: 1,
                    },
                  ],
                },
                {
                  type: "variableDeclaration",
                  variableType: { array: false, name: "WORD" },
                  annotations: [],
                  declarations: [
                    {
                      annotations: [{ key: "comment", value: "0x0010  Agressively trim working set" }],
                      name: "IMAGE_FILE_AGGRESIVE_WS_TRIM",
                      bits: 1,
                    },
                  ],
                },
                {
                  type: "variableDeclaration",
                  variableType: { array: false, name: "WORD" },
                  annotations: [],
                  declarations: [
                    {
                      annotations: [{ key: "comment", value: "0x0020  App can handle >2gb addresses" }],
                      name: "IMAGE_FILE_LARGE_ADDRESS_AWARE",
                      bits: 1,
                    },
                  ],
                },
                {
                  type: "variableDeclaration",
                  variableType: { array: false, name: "WORD" },
                  annotations: [
                    { key: "comment", value: "0x0040  Reserved" },
                    { key: "hidden", value: "true" },
                  ],
                  bits: 1,
                },
                {
                  type: "variableDeclaration",
                  variableType: { array: false, name: "WORD" },
                  annotations: [],
                  declarations: [
                    {
                      annotations: [{ key: "comment", value: "0x0080  Bytes of machine word are reversed" }],
                      name: "IMAGE_FILE_BYTES_REVERSED_LO",
                      bits: 1,
                    },
                  ],
                },
                {
                  type: "variableDeclaration",
                  variableType: { array: false, name: "WORD" },
                  annotations: [],
                  declarations: [
                    {
                      annotations: [{ key: "comment", value: "0x0100  32 bit word machine" }],
                      name: "IMAGE_FILE_32BIT_MACHINE",
                      bits: 1,
                    },
                  ],
                },
                {
                  type: "variableDeclaration",
                  variableType: { array: false, name: "WORD" },
                  annotations: [],
                  declarations: [
                    {
                      annotations: [
                        { key: "comment", value: "0x0200  Debugging info stripped from file in .DBG file" },
                      ],
                      name: "IMAGE_FILE_DEBUG_STRIPPED",
                      bits: 1,
                    },
                  ],
                },
                {
                  type: "variableDeclaration",
                  variableType: { array: false, name: "WORD" },
                  annotations: [],
                  declarations: [
                    {
                      annotations: [
                        {
                          key: "comment",
                          value: "0x0400  If Image is on removable media, copy and run from the swap file",
                        },
                      ],
                      name: "IMAGE_FILE_REMOVABLE_RUN_FROM_SWAP",
                      bits: 1,
                    },
                  ],
                },
                {
                  type: "variableDeclaration",
                  variableType: { array: false, name: "WORD" },
                  annotations: [],
                  declarations: [
                    {
                      annotations: [
                        {
                          key: "comment",
                          value: "0x0800  If Image is on Net, copy and run from the swap file",
                        },
                      ],
                      name: "IMAGE_FILE_NET_RUN_FROM_SWAP",
                      bits: 1,
                    },
                  ],
                },
                {
                  type: "variableDeclaration",
                  variableType: { array: false, name: "WORD" },
                  annotations: [],
                  declarations: [
                    {
                      annotations: [{ key: "comment", value: "0x1000  System File" }],
                      name: "IMAGE_FILE_SYSTEM",
                      bits: 1,
                    },
                  ],
                },
                {
                  type: "variableDeclaration",
                  variableType: { array: false, name: "WORD" },
                  annotations: [],
                  declarations: [
                    {
                      annotations: [{ key: "comment", value: "0x2000  File is a DLL" }],
                      name: "IMAGE_FILE_DLL",
                      bits: 1,
                    },
                  ],
                },
                {
                  type: "variableDeclaration",
                  variableType: { array: false, name: "WORD" },
                  annotations: [],
                  declarations: [
                    {
                      annotations: [
                        { key: "comment", value: "0x4000  File should only be run on a UP machine" },
                      ],
                      name: "IMAGE_FILE_UP_SYSTEM_ONLY",
                      bits: 1,
                    },
                  ],
                },
                {
                  type: "variableDeclaration",
                  variableType: { array: false, name: "WORD" },
                  annotations: [],
                  declarations: [
                    {
                      annotations: [{ key: "comment", value: "0x8000  Bytes of machine word are reversed" }],
                      name: "IMAGE_FILE_BYTES_REVERSED_HI",
                      bits: 1,
                    },
                  ],
                },
              ],
            },
          },
          name: "FILE_CHARACTERISTICS",
          annotations: [{ key: "comment", value: "WORD" }],
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

  test("creates DEX definition", done => {
    iterateStructures(
      (name, input) => {
        const definition = importer.readInput(input);
        expect(definition).toBeDefined();
        expect(definition.type).toEqual("definition");
        const { content } = definition;

        expect(content).toHaveLength(155);
        const functionDeclaration = content[9];
        expect(functionDeclaration).toEqual({
          type: "functionDeclaration",
          forwardDeclaration: false,
          name: "uleb128p1_value",
          parameters: [
            {
              type: {
                name: "uleb128",
                array: false,
              },
              name: "u",
              reference: true,
            },
          ],
          returnType: {
            name: "int",
            array: false,
          },
          content: {
            type: "statementList",
            statements: [
              {
                type: "returnStatement",
                expression: {
                  type: "primaryExpression",
                  expression: {
                    type: "castExpression",
                    typeName: {
                      type: "primaryExpression",
                      expression: {
                        type: "identifier",
                        name: "int",
                      },
                    },
                    // TODO The operator priority is wrong, the cast shall not be applied
                    // to the whole expression
                    expression: {
                      type: "binaryExpression",
                      operator: "-",
                      left: {
                        type: "primaryExpression",
                        expression: {
                          type: "functionCall",
                          name: "uleb128_value",
                          arguments: [
                            {
                              type: "primaryExpression",
                              expression: {
                                type: "identifier",
                                name: "u",
                              },
                            },
                          ],
                        },
                      },
                      right: {
                        type: "primaryExpression",
                        expression: {
                          type: "number",
                          value: 1,
                        },
                      },
                    },
                  },
                },
              },
            ],
          },
        });
      },
      done,
      name => name === "DEX.bt"
    );
  });
});
