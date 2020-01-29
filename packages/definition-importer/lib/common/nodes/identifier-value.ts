import { Value } from "./value";

export class IdentifierValue extends Value {
  public constructor(private _name: string) {
    super();
  }

  public get name() {
    return this._name;
  }
}
