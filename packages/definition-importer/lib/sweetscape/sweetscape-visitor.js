"use strict";

function getVisitor(parser) {
  class Visitor extends parser.getBaseCstVisitorConstructorWithDefaults() {}

  return new Visitor();
}
module.exports = { getVisitor };
