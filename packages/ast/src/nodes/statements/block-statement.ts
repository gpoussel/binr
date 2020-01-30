import { Statement } from "./statement";

export class BlockStatement extends Statement {
  public constructor(private _content: Statement[]) {
    super();
  }

  public get content(): Statement[] {
    return this._content;
  }
}
