"use strict";

import _ from "lodash";

import { Type } from "./type";

export class BitmaskType extends Type {
  private parentType: any;
  private bitmask: any;
  constructor(parentType, bitmask) {
    super();
    this.parentType = parentType;
    this.bitmask = bitmask;
  }

  public read(buffer, environment) {
    const value = this.parentType.read(buffer, environment);
    const matchedItems = [];
    _.each(this.bitmask.entries, (entry) => {
      if ((value & entry.value) !== 0) {
        matchedItems.push(entry.key);
      }
    });
    return matchedItems;
  }
}
