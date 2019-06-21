import { Definition, Structure } from "@binr/model";
import { BinaryReader } from "../lib/binary-reader";

const createEmptyBuffer = () => Buffer.from([]);
const createEmptyStructure = (name: string) => {
  const structure = new Structure(name, []);
  structure.setEndianness("big");
  return structure;
};

describe("BinaryReader", () => {
  test("throws an error when no structure defined", () => {
    const binaryReader = new BinaryReader();
    const buffer = createEmptyBuffer();
    const definition = new Definition([], [], []);
    expect(() => binaryReader.read(buffer, definition)).toThrow();
  });

  test("uses the only existing structure without giving its name", () => {
    const binaryReader = new BinaryReader();
    const buffer = createEmptyBuffer();
    const definition = new Definition([createEmptyStructure("MyStructure")], [], []);
    const result = binaryReader.read(buffer, definition);
    expect(result).toEqual({});
  });
});
