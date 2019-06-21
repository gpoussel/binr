import { find, get } from "lodash";

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
    const matchingEntry = find(this.enumeration.entries, (entry) => entry.value === value);
    return get(matchingEntry, "key");
  }
}
