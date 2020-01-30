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

describe("Visitor", () => {
  test("visits AST", () => {
    const baseVisitor = new BaseAstVisitor();
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
});
