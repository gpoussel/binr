import {
  BaseAstVisitor,
  EnumDeclarationStatement,
  FunctionDeclarationStatement,
  StructDeclarationStatement,
  UnionDeclarationStatement,
} from "@binr/ast";

import { SweetscapeDefinitionImporter } from "../..";
import { AssetLoader } from "../utils/010-structures";

class TopLevelElementVisitor extends BaseAstVisitor {
  private _topLevelElements: string[] = [];

  visitFunctionDeclarationStatement(node: FunctionDeclarationStatement): boolean {
    this._topLevelElements.push(`function: ${node.name}`);
    // We only need top-level elements, so returning false here
    return false;
  }

  visitEnumDeclarationStatement(node: EnumDeclarationStatement): boolean {
    this._topLevelElements.push(`enum: ${node.name}`);
    return false;
  }

  visitStructDeclarationStatement(node: StructDeclarationStatement): boolean {
    this._topLevelElements.push(`struct: ${node.name}`);
    return false;
  }

  visitUnionDeclarationStatement(node: UnionDeclarationStatement): boolean {
    this._topLevelElements.push(`union: ${node.name}`);
    return false;
  }

  public get topLevelElements(): string[] {
    return this._topLevelElements;
  }
}

class DebugVisitor extends BaseAstVisitor {
  visitStructDeclarationStatement(node: StructDeclarationStatement): boolean {
    if (!node.name) {
      console.log(node);
    }
    return true;
  }
}

describe("Sweetscape Importer", () => {
  const importer = new SweetscapeDefinitionImporter();
  const loader = new AssetLoader();

  beforeAll(loader.load());

  loader.iterateElements((categoryType, elementName, getter) => {
    test(`reads top-level elements in ${categoryType} ${elementName}`, () => {
      const element = getter();
      const definition = importer.readInput(element.content);
      const visitor = new TopLevelElementVisitor();
      definition.accept(visitor);
      expect(visitor.topLevelElements).toMatchSnapshot();
    });
  });

  loader.iterateElements((categoryType, elementName, getter) => {
    test(`reads ParameterDeclaration in ${categoryType} ${elementName}`, () => {
      const element = getter();
      const definition = importer.readInput(element.content);
      const visitor = new DebugVisitor();
      definition.accept(visitor);
    });
  });
});
