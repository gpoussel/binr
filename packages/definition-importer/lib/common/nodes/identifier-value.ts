import { Value } from "./value";

export class IdentifierValue extends Value {
  private _name: string;

  public constructor(name: string) {
    super("identifierValue");
    this._name = name;
  }

  public get name() {
    return this._name;
  }
}
