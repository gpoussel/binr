import { Node } from "./node";
import { Statement } from "./statements/statement";

export class Definition extends Node {
  public constructor(private _content: Statement[]) {
    super();
  }

  public get content(): Statement[] {
    return this._content;
  }
}
