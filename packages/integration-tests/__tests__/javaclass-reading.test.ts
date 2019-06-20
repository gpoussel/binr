"use strict";

import fs from "fs";
const _ = require("lodash");
import { BinaryReader } from "@binr/binary-reader";
import { DefinitionReader } from "@binr/definition-reader";

const pathToBinaryFixtures = `${__dirname}/../__fixtures__/binaries`;
const pathToDefinitionFixtures = `${__dirname}/../__fixtures__/definitions`;

describe("JAVA Class reading", () => {
  const definitionReader = new DefinitionReader();
  const javaClassDefinitionFile = fs.readFileSync(`${pathToDefinitionFixtures}/java_class.binr`);
  const javaClassDefinition = definitionReader.readInput(javaClassDefinitionFile.toString());

  test("reads CumcumberModules.class file", () => {
    const sampleJavaClassFile = `${pathToBinaryFixtures}/CucumberModules.class`;
    const sampleJavaClassBuffer = fs.readFileSync(sampleJavaClassFile);

    const binaryReader = new BinaryReader();
    const value = binaryReader.read(sampleJavaClassBuffer, javaClassDefinition, "JVMClass");
    expect(value).toBeDefined();
    expect(value).toMatchSnapshot();
  });

  test("reads SmartLeaves.class file", () => {
    const sampleJavaClassFile = `${pathToBinaryFixtures}/SmartLeaves.class`;
    const sampleJavaClassBuffer = fs.readFileSync(sampleJavaClassFile);

    const binaryReader = new BinaryReader();
    const value = binaryReader.read(sampleJavaClassBuffer, javaClassDefinition, "JVMClass");
    expect(value).toBeDefined();
    expect(value).toMatchSnapshot();
  });
});
