"use strict";

const _ = require("lodash");

class ValueAggregator {
  constructor() {
    this.value = {};
  }

  set(key, value) {
    this.value[key] = value;
  }

  build() {
    return _.clone(this.value);
  }
}

module.exports = ValueAggregator;
