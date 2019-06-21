import * as assert from "assert";

export class Structure {
  private _name: string;
  private _statements: any[];
  private _endianness: string;

  constructor(name, statements) {
    this._name = name;
    this._statements = statements;
  }

  public setEndianness(endianness) {
    assert(endianness === "big" || endianness === "little");
    this._endianness = endianness;
  }

  get endianness(): string {
    return this._endianness;
  }

  get name(): string {
    return this._name;
  }

  get statements(): any[] {
    return this._statements;
  }
}
