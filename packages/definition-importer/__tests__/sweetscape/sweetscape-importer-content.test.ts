import {
  Definition,
  DoWhileStatement,
  EmptyStatement,
  EnumDeclarationStatement,
  ExpressionStatement,
  ForStatement,
  ForwardStructDeclarationStatement,
  FunctionDeclarationStatement,
  IfElseStatement,
  IfStatement,
  InlineEnumDeclarationStatement,
  InlineStructDeclarationStatement,
  Node,
  ReturnStatement,
  StructDeclarationStatement,
  SwitchStatement,
  TypedefStatement,
  UnionDeclarationStatement,
  VariableDeclarationStatement,
  WhileStatement,
} from "@binr/ast";
import { flatMap } from "lodash";

import { SweetscapeDefinitionImporter } from "../../lib/sweetscape/sweetscape-definition-importer";
import { AssetLoader } from "../utils/010-structures";

function visit(node: Node): string[] {
  if (node instanceof Definition) {
    return flatMap(node.content, visit);
  } else if (node instanceof FunctionDeclarationStatement) {
    return [`function: ${node.name}`];
  } else if (node instanceof EnumDeclarationStatement) {
    return [`enum: ${node.name}`];
  } else if (node instanceof StructDeclarationStatement) {
    return [`struct: ${node.name}`];
  } else if (node instanceof UnionDeclarationStatement) {
    return [`union: ${node.name}`];
  } else if (
    node instanceof ExpressionStatement ||
    node instanceof VariableDeclarationStatement ||
    node instanceof TypedefStatement ||
    node instanceof WhileStatement ||
    node instanceof IfStatement ||
    node instanceof IfElseStatement ||
    node instanceof EmptyStatement ||
    node instanceof InlineStructDeclarationStatement ||
    node instanceof InlineEnumDeclarationStatement ||
    node instanceof ForStatement ||
    node instanceof ReturnStatement ||
    node instanceof ForwardStructDeclarationStatement ||
    node instanceof DoWhileStatement ||
    node instanceof SwitchStatement
  ) {
    return [];
  } else {
    throw new Error(node.constructor.name);
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
      expect(visit(definition)).toMatchSnapshot();
    });
  });
});
