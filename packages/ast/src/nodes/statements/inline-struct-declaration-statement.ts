import { ParameterDeclaration } from "../parameter-declaration";
import { VariableDeclaration } from "../variable-declaration";
import { BlockStatement } from "./block-statement";
import { Statement } from "./statement";

export class InlineStructDeclarationStatement extends Statement {
  public constructor(
    private _alias: string | undefined,
    private _variableDeclaration: VariableDeclaration,
    private _parameters: ParameterDeclaration[],
    private _body: BlockStatement,
  ) {
    super();
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
