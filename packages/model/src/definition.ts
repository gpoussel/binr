import { Bitmask } from "./bitmask";
import { Enumeration } from "./enumeration";
import { Structure } from "./structure";

export class Definition {
  private _structures: Structure[];
  private _enumerations: Enumeration[];
  private _bitmasks: Bitmask[];

  constructor(structures: Structure[], enumerations: Enumeration[], bitmasks: Bitmask[]) {
    this._structures = structures;
    this._enumerations = enumerations;
    this._bitmasks = bitmasks;
  }

  get structures(): Structure[] {
    return this._structures;
  }

  get enumerations(): Enumeration[] {
    return this._enumerations;
  }

  get bitmasks(): Bitmask[] {
    return this._bitmasks;
  }
}
