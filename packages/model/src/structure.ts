import * as assert from "assert";
import { Statement } from "./statement/statement";

export class Structure {
  private _name: string;
  private _statements: Statement[];
  private _endianness: string | undefined;

  constructor(name: string, statements: Statement[]) {
    this._name = name;
    this._statements = statements;
  }

  public setEndianness(endianness: string) {
    assert(endianness === "big" || endianness === "little");
    this._endianness = endianness;
  }

  get endianness(): string | undefined {
    return this._endianness;
  }

  get name(): string {
    return this._name;
  }

  get statements(): Statement[] {
    return this._statements;
  }
}
