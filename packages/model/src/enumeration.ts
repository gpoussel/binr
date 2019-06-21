import { EnumEntry } from "./enum-entry";

export class Enumeration {
  private _name: string;
  private _parentType: any;
  private _entries: EnumEntry[];

  constructor(name: string, parentType: any, entries: EnumEntry[]) {
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

  get entries(): EnumEntry[] {
    return this._entries;
  }
}
