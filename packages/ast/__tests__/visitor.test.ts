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
    const spyAnnotation = spyOn(baseVisitor, "visitAnnotation").and.returnValue(true);
    const spyVariableDeclaration = spyOn(baseVisitor, "visitVariableDeclaration").and.returnValue(true);
    const spyNamedType = spyOn(baseVisitor, "visitNamedType").and.returnValue(true);
    const spyBlockStatement = spyOn(baseVisitor, "visitBlockStatement").and.returnValue(true);
    const spyVariableDeclarationStatement = spyOn(
      baseVisitor,
      "visitVariableDeclarationStatement",
    ).and.returnValue(true);
    const spyDefinition = spyOn(baseVisitor, "visitDefinition").and.returnValue(true);
    definition.accept(baseVisitor);
    expect(spyAnnotation).toHaveBeenCalledTimes(2);
    expect(spyVariableDeclaration).toHaveBeenCalledTimes(1);
    expect(spyNamedType).toHaveBeenCalledTimes(1);
    expect(spyBlockStatement).toHaveBeenCalledTimes(1);
    expect(spyVariableDeclarationStatement).toHaveBeenCalledTimes(1);
    expect(spyDefinition).toHaveBeenCalledTimes(1);
  });
});
