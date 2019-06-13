"use strict";

function getVisitor(parser) {
  class Visitor extends parser.getBaseCstVisitorConstructorWithDefaults() {
    definition(ctx) {
      return ctx;
    }
  }

  return new Visitor();
}
module.exports = { getVisitor };
