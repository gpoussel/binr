import { BlockStatement } from "./block-statement";
import { ParameterDeclaration } from "./parameter-declaration";
import { Statement } from "./statement";
import { VariableDeclaration } from "./variable-declaration";

export class UnionDeclarationStatement extends Statement {
  private _alias: string | undefined;
  private _variableDeclaration: VariableDeclaration;
  private _parameters: ParameterDeclaration[];
  private _body: BlockStatement;

  public constructor(
    alias: string | undefined,
    variableDeclaration: VariableDeclaration,
    parameters: ParameterDeclaration[],
    body: BlockStatement,
  ) {
    super();
    this._alias = alias;
    this._variableDeclaration = variableDeclaration;
    this._parameters = parameters;
    this._body = body;
  }

  public get alias(): string | undefined {
    return this._alias;
  }

  public get variableDeclaration(): VariableDeclaration {
    return this._variableDeclaration;
  }

  public get parameters(): ParameterDeclaration[] {
    return this._parameters;
  }

  public get body(): BlockStatement {
    return this._body;
  }
}
