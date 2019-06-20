"use strict";

import assert from "assert";
import _ from "lodash";

import { ValueAggregator } from "@binr/shared";

import { Type } from "./type";

export class StructureType extends Type {
  private structure: any;
  constructor(structure) {
    super();
    assert(!_.isUndefined(structure));
    this.structure = structure;
  }

  public read(buffer, environment) {
    const valueAggregator = new ValueAggregator();
    const nestedEnvironment = environment.nestedScope();
    _.each(this.structure.statements, (statement) => {
      buffer.setEndianness(this.structure.endianness);
      statement.read(buffer, nestedEnvironment, valueAggregator);
    });
    return valueAggregator.build();
  }
}
