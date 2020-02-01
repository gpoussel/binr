import { EvaluationContext, EvaluationInput } from "../../evaluation";
import { AstVisitor } from "../../visitor";
import { ParameterDeclaration } from "../parameter-declaration";
import { Type } from "../types";
import { Statement } from "./statement";

export class ForwardFunctionDeclarationStatement extends Statement {
  public constructor(
    private _returnType: Type,
    private _name: string,
    private _parameters: ParameterDeclaration[],
  ) {
    super();
  }

  public get returnType(): Type {
    return this._returnType;
  }

  public get name(): string {
    return this._name;
  }

  public get parameters(): ParameterDeclaration[] {
    return this._parameters;
  }

  public evaluate(_context: EvaluationContext, _input: EvaluationInput): void {
    // Nothing to do
  }

  protected accept0(visitor: AstVisitor): void {
    if (visitor.visitForwardFunctionDeclarationStatement(this)) {
      this._returnType.accept(visitor);
      this._parameters.map((s) => s.accept(visitor));
    }
    visitor.endVisitForwardFunctionDeclarationStatement(this);
  }
}
