"use strict";

import _ from "lodash";

import { Statement } from "./statement";

export class BlockStatement extends Statement {
  private innerStatements: any[];

  constructor(innerStatements) {
    super();
    this.innerStatements = innerStatements;
  }

  public read(buffer, environment, valueAggregator) {
    _.each(this.innerStatements, (s) => s.read(buffer, environment, valueAggregator));
  }
}
