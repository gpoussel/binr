import { each } from "lodash";

import {
  Annotation,
  BlockStatement,
  BooleanValueExpression,
  Definition,
  NamedType,
  NumberValueExpression,
  VariableDeclaration,
  VariableDeclarationStatement,
} from "../src/nodes";
import { BaseAstVisitor } from "../src/visitor/base-ast-visitor";

const definition = new Definition(
  [
    new BlockStatement([
      new VariableDeclarationStatement(
        new NamedType("int", [], false),
        [],
        undefined,
        [new VariableDeclaration("variable", undefined, undefined, [], undefined, [])],
        [new Annotation("variable", new NumberValueExpression(1))],
      ),
    ]),
  ],
  [new Annotation("key", new BooleanValueExpression(false))],
);

describe("Visitor", () => {
  test("visits AST", () => {
    const baseVisitor = new BaseAstVisitor();
    const types = [
      { type: "Annotation", calls: 2 },
      { type: "VariableDeclaration", calls: 1 },
      { type: "NamedType", calls: 1 },
      { type: "BlockStatement", calls: 1 },
      { type: "VariableDeclarationStatement", calls: 1 },
      { type: "Definition", calls: 1 },
      { type: "IfStatement", calls: 0 },
      { type: "EnumDeclarationStatement", calls: 0 },
    ];
    const spies: { [key: string]: { start: jasmine.Spy; end: jasmine.Spy } } = {};
    each(types, ({ type }) => {
      spies[type] = {
        start: spyOn(baseVisitor, `visit${type}` as keyof BaseAstVisitor).and.returnValue(true),
        end: spyOn(baseVisitor, `endVisit${type}` as keyof BaseAstVisitor),
      };
    });
    definition.accept(baseVisitor);
    each(types, ({ type, calls }) => {
      expect(spies[type].start).toHaveBeenCalledTimes(calls);
      expect(spies[type].end).toHaveBeenCalledTimes(calls);
    });
  });

  test("stops visiting when returning false", () => {
    const baseVisitor = new BaseAstVisitor();
    const types = [
      { type: "Annotation", calls: 1, returnValue: true },
      { type: "VariableDeclaration", calls: 0, returnValue: true },
      { type: "NamedType", calls: 0, returnValue: true },
      { type: "BlockStatement", calls: 1, returnValue: false },
      { type: "VariableDeclarationStatement", calls: 0, returnValue: true },
      { type: "Definition", calls: 1, returnValue: true },
      { type: "IfStatement", calls: 0, returnValue: true },
      { type: "EnumDeclarationStatement", calls: 0, returnValue: true },
    ];
    const spies: { [key: string]: { start: jasmine.Spy; end: jasmine.Spy } } = {};
    each(types, ({ type, returnValue }) => {
      spies[type] = {
        start: spyOn(baseVisitor, `visit${type}` as keyof BaseAstVisitor).and.returnValue(returnValue),
        end: spyOn(baseVisitor, `endVisit${type}` as keyof BaseAstVisitor),
      };
    });
    definition.accept(baseVisitor);
    each(types, ({ type, calls }) => {
      expect(spies[type].start).toHaveBeenCalledTimes(calls);
      expect(spies[type].end).toHaveBeenCalledTimes(calls);
    });
  });
});
