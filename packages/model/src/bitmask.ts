import { BitmaskEntry } from "./bitmask-entry";

export class Bitmask {
  private _name: string;
  private _parentType: any;
  private _entries: BitmaskEntry[];

  constructor(name: string, parentType: any, entries: BitmaskEntry[]) {
    this._name = name;
    this._parentType = parentType;
    this._entries = entries;
  }

  get name(): string {
    return this._name;
  }

  get parentType(): any {
    return this._parentType;
  }

  get entries(): BitmaskEntry[] {
    return this._entries;
  }
}
