"use strict";

import _ from "lodash";

import { Type } from "./type";

export class EnumerationType extends Type {
  private parentType: any;
  private enumeration: any;
  constructor(parentType, enumeration) {
    super();
    this.parentType = parentType;
    this.enumeration = enumeration;
  }

  public read(buffer, environment) {
    const value = this.parentType.read(buffer, environment);
    const matchingEntry = _.find(this.enumeration.entries, (entry) => entry.value === value);
    return _.get(matchingEntry, "key");
  }
}
