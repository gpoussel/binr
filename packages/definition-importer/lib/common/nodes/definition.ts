import { Node } from "./node";
import { Statement } from "./statements/statement";

export class Definition extends Node {
  private _content: Statement[];

  public constructor(content: Statement[]) {
    super();
    this._content = content;
  }

  public get content(): Statement[] {
    return this._content;
  }
}
