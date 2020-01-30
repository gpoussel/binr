import { Statement } from "./statement";

export class ForwardStructDeclarationStatement extends Statement {
  public constructor(private _name: string) {
    super();
  }

  public get name(): string | undefined {
    return this._name;
  }
}
