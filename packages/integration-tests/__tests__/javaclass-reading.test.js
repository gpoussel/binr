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

  const sampleJavaClassFile = `${pathToBinaryFixtures}/CucumberModules.class`;
  const sampleJavaClassBuffer = fs.readFileSync(sampleJavaClassFile);

  test("reads class file", () => {
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
    expect(value.accessFlags).toEqual(["ACC_PUBLIC"]);
    expect(value.thisClass).toEqual(7);
    expect(value.superClass).toEqual(8);
    expect(value.interfacesCount).toEqual(0);
    expect(value.interfaces).toHaveLength(0);
    expect(value.fieldsCount).toEqual(1);
    expect(value.fields).toEqual([25]);
    expect(value.attributesCount).toEqual(9);
    expect(value.attributes).toEqual([10, 2, 11, 0, 0, 12, 0, 6, 1]);
  });
});
