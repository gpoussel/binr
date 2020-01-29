import { Statement } from "./statement";
import { Type } from "./type";
import { BlockStatement } from "./block-statement";
import { ParameterDeclaration } from "./parameter-declaration";

export class FunctionDeclarationStatement extends Statement {
  private _returnType: Type;
  private _name: string;
  private _parameters: ParameterDeclaration[];
  private _forwardDeclaration: boolean;
  private _body: BlockStatement;

  public constructor(
    returnType: Type,
    name: string,
    parameters: ParameterDeclaration[],
    forwardDeclaration: boolean,
    body: BlockStatement,
  ) {
    super();
    this._returnType = returnType;
    this._name = name;
    this._parameters = parameters;
    this._forwardDeclaration = forwardDeclaration;
    this._body = body;
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
