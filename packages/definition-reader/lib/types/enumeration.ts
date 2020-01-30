import { Enumeration } from "@binr/model";
import { BufferWrapper, Environment } from "@binr/shared";
import { find, get } from "lodash";

import { Type } from "./type";

export class EnumerationType extends Type {
  private parentType: Type;
  private enumeration: any;
  constructor(parentType: Type, enumeration: Enumeration) {
    super();
    this.parentType = parentType;
    this.enumeration = enumeration;
  }

  public read(buffer: BufferWrapper, environment: Environment) {
    const value = this.parentType.read(buffer, environment);
    const matchingEntry = find(this.enumeration.entries, (entry) => entry.value === value);
    return get(matchingEntry, "key");
  }
}
