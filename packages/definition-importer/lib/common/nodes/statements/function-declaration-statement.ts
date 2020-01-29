import { ParameterDeclaration } from "../parameter-declaration";
import { Type } from "../type";
import { BlockStatement } from "./block-statement";
import { Statement } from "./statement";

export class FunctionDeclarationStatement extends Statement {
  public constructor(
    private _returnType: Type,
    private _name: string,
    private _parameters: ParameterDeclaration[],
    private _forwardDeclaration: boolean,
    private _body: BlockStatement,
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

  public get forwardDeclaration(): boolean {
    return this._forwardDeclaration;
  }

  public get body(): BlockStatement {
    return this._body;
  }
}
