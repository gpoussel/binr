"use strict";

export class Definition {
  private structures: any[];
  private enumerations: any[];

  constructor(structures, enumerations) {
    this.structures = structures;
    this.enumerations = enumerations;
  }
}

module.exports = Definition;
