export class Enumeration {
  private _name: string;
  private _parentType: any;
  private _entries: any[];

  constructor(name, parentType, entries) {
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

  get entries(): any[] {
    return this._entries;
  }
}
