import { Bitmask } from "@binr/model";
import { BufferWrapper, Environment } from "@binr/shared";
import { each } from "lodash";

import { Type } from "./type";

export class BitmaskType extends Type {
  private parentType: Type;
  private bitmask: any;
  constructor(parentType: Type, bitmask: Bitmask) {
    super();
    this.parentType = parentType;
    this.bitmask = bitmask;
  }

  public read(buffer: BufferWrapper, environment: Environment) {
    const value = this.parentType.read(buffer, environment);
    const matchedItems: any[] = [];
    each(this.bitmask.entries, (entry) => {
      if ((value & entry.value) !== 0) {
        matchedItems.push(entry.key);
      }
    });
    return matchedItems;
  }
}
