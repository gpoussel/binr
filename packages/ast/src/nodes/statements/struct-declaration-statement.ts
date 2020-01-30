import { Annotation } from "../annotation";
import { ParameterDeclaration } from "../parameter-declaration";
import { BlockStatement } from "./block-statement";
import { Statement } from "./statement";

export class StructDeclarationStatement extends Statement {
  public constructor(
    private _name: string | undefined,
    private _parameters: ParameterDeclaration[],
    private _body: BlockStatement,
    private _annotations: Annotation[] = [],
  ) {
    super();
  }

  public get name(): string | undefined {
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
}
