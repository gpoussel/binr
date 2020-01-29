import { Expression } from "../expressions";
import { Statement } from "./statement";

export class ReturnStatement extends Statement {
  public constructor(private _expression?: Expression) {
    super();
  }

  public get expression(): Expression | undefined {
    return this._expression;
  }
}
