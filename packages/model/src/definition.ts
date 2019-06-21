export class Definition {
  private _structures: any[];
  private _enumerations: any[];
  private _bitmasks: any[];

  constructor(structures, enumerations, bitmasks) {
    this._structures = structures;
    this._enumerations = enumerations;
    this._bitmasks = bitmasks;
  }

  get structures(): any[] {
    return this._structures;
  }

  get enumerations(): any[] {
    return this._enumerations;
  }

  get bitmasks(): any[] {
    return this._bitmasks;
  }
}
