import * as assert from "assert";
import { each, isUndefined } from "lodash";

import { ValueAggregator } from "@binr/shared";

import { Type } from "./type";

export class StructureType extends Type {
  private structure: any;
  constructor(structure) {
    super();
    assert(!isUndefined(structure));
    this.structure = structure;
  }

  public read(buffer, environment) {
    const valueAggregator = new ValueAggregator();
    const nestedEnvironment = environment.nestedScope();
    each(this.structure.statements, (statement) => {
      if (!isUndefined(this.structure.endianness)) {
        buffer.setEndianness(this.structure.endianness);
      }
      statement.read(buffer, nestedEnvironment, valueAggregator);
    });
    return valueAggregator.build();
  }
}
