export class Definition {
  private _structures: any[];
  private enumerations: any[];
  private bitmasks: any[];

  constructor(structures, enumerations, bitmasks) {
    this._structures = structures;
    this.enumerations = enumerations;
    this.bitmasks = bitmasks;
  }

  get structures(): any[] {
    return this._structures;
  }
}
