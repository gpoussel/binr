import { EvaluationContext, EvaluationInput, EvaluationResult } from "../../evaluation";
import { AstVisitor } from "../../visitor";
import { Annotation } from "../annotation";
import { ParameterDeclaration } from "../parameter-declaration";
import { BlockStatement } from "./block-statement";
import { Statement } from "./statement";

export class StructDeclarationStatement extends Statement {
  public constructor(
    private _name: string,
    private _parameters: ParameterDeclaration[],
    private _body: BlockStatement,
    private _annotations: Annotation[] = [],
  ) {
    super();
  }

  public get name(): string {
    return this._name;
  }

  public get parameters(): ParameterDeclaration[] {
    return this._parameters;
  }

  public get body(): BlockStatement {
    return this._body;
  }

  public get annotations(): Annotation[] {
    return this._annotations;
  }

  public evaluate(_context: EvaluationContext, _input: EvaluationInput): EvaluationResult {
    console.log(this._name);
    // Nothing to do
    return {};
  }

  protected accept0(visitor: AstVisitor): void {
    if (visitor.visitStructDeclarationStatement(this)) {
      this._parameters.map((s) => s.accept(visitor));
      this._body.accept(visitor);
      this._annotations.map((s) => s.accept(visitor));
    }
    visitor.endVisitStructDeclarationStatement(this);
  }
}
