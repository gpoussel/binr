import { Statement } from "./statement";

export class BlockStatement extends Statement {
  private _content: Statement[];

  public constructor(content: Statement[]) {
    super("blockStatement");
    this._content = content;
  }

  public get content(): Statement[] {
    return this._content;
  }
}
