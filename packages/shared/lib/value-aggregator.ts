"use strict";

import _ from "lodash";

export class ValueAggregator {
  private value: {};

  constructor() {
    this.value = {};
  }

  public set(key, value) {
    this.value[key] = value;
  }

  public build() {
    return _.clone(this.value);
  }
}
