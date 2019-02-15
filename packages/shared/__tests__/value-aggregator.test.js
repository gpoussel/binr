"use strict";

const ValueAggregator = require("../lib/value-aggregator");

describe("ValueAggregator", () => {
  test("basic set & build", () => {
    const aggregator = new ValueAggregator();
    expect(aggregator.build()).toEqual({});

    aggregator.set("a", 1);
    expect(aggregator.build()).toEqual({
      a: 1,
    });
  });
});
