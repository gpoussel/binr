"use strict";

const fs = require("fs");
const _ = require("lodash");
const { BinaryReader } = require("@binr/binary-reader");
const { DefinitionReader } = require("@binr/definition-reader");

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
    expect(value.magic).toBe(0xcafebabe);
    expect(value.majorVersion).toBe(51);
    expect(value.minorVersion).toBe(0);
    expect(value.constantPoolSize).toBe(42);
    expect(value.constantPool).toHaveLength(value.constantPoolSize - 1);

    const strings = value.constantPool.filter(cp => cp.tag === "TAG_UTF8").map(cp => _.join(cp.bytes, ""));
    expect(strings).toEqual([
      "SCENARIO",
      "Lcom/google/inject/Module;",
      "Deprecated",
      "RuntimeVisibleAnnotations",
      "Ljava/lang/Deprecated;",
      "<init>",
      "()V",
      "Code",
      "LineNumberTable",
      "LocalVariableTable",
      "this",
      "Lcucumber/api/guice/CucumberModules;",
      "createScenarioModule",
      "()Lcom/google/inject/Module;",
      "(Lcucumber/runtime/java/guice/ScenarioScope;)Lcom/google/inject/Module;",
      "scenarioScope",
      "Lcucumber/runtime/java/guice/ScenarioScope;",
      "<clinit>",
      "SourceFile",
      "CucumberModules.java",
      "cucumber/runtime/java/guice/impl/ScenarioModule",
      "cucumber/api/guice/CucumberModules",
      "java/lang/Object",
      "cucumber/api/guice/CucumberScopes",
      "createScenarioScope",
      "()Lcucumber/runtime/java/guice/ScenarioScope;",
      "(Lcucumber/runtime/java/guice/ScenarioScope;)V",
    ]);
    expect(value.accessFlags).toEqual(["ACC_PUBLIC", "ACC_SUPER"]);
    expect(value.thisClass).toEqual(7);
    expect(value.superClass).toEqual(8);
    expect(value.interfacesCount).toEqual(0);
    expect(value.interfaces).toHaveLength(0);
    expect(value.fieldsCount).toEqual(1);
    expect(value.fields[0]).toEqual({
      accessFlags: ["ACC_PUBLIC", "ACC_STATIC", "ACC_FINAL"],
      attributes: [
        {
          attributeLength: 0,
          attributeNameIndex: 11,
          info: [],
        },
        {
          attributeLength: 6,
          attributeNameIndex: 12,
          info: [0, 1, 0, 13, 0, 0],
        },
      ],
      attributesCount: 2,
      descriptorIndex: 10,
      nameIndex: 9,
    });
    expect(value.methodsCount).toEqual(4);
    expect(value.methods[0]).toEqual({
      accessFlags: ["ACC_PUBLIC"],
      attributes: [
        {
          attributeLength: 47,
          attributeNameIndex: 16,
          info: [
            0,
            1,
            0,
            1,
            0,
            0,
            0,
            5,
            42,
            183,
            0,
            1,
            177,
            0,
            0,
            0,
            2,
            0,
            17,
            0,
            0,
            0,
            6,
            0,
            1,
            0,
            0,
            0,
            12,
            0,
            18,
            0,
            0,
            0,
            12,
            0,
            1,
            0,
            0,
            0,
            5,
            0,
            19,
            0,
            20,
            0,
            0,
          ],
        },
      ],
      attributesCount: 1,
      descriptorIndex: 15,
      nameIndex: 14,
    });
    expect(value.attributesCount).toEqual(1);
    expect(value.attributes).toEqual([
      {
        attributeLength: 2,
        attributeNameIndex: 27,
        info: [0, 28],
      },
    ]);
  });

  test("reads SmartLeaves.class file", () => {
    const sampleJavaClassFile = `${pathToBinaryFixtures}/SmartLeaves.class`;
    const sampleJavaClassBuffer = fs.readFileSync(sampleJavaClassFile);

    const binaryReader = new BinaryReader();
    const value = binaryReader.read(sampleJavaClassBuffer, javaClassDefinition, "JVMClass");
    expect(value).toBeDefined();
    expect(value.magic).toBe(0xcafebabe);
    expect(value.majorVersion).toBe(52);
    expect(value.minorVersion).toBe(0);
  });
});
