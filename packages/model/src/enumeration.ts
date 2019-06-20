"use strict";

export class Enumeration {
  private name: string;
  private parentType: any;
  private entries: any[];

  constructor(name, parentType, entries) {
    this.name = name;
    this.parentType = parentType;
    this.entries = entries;
  }
}
