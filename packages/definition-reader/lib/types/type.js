"use strict";

class Type {
  read() {
    throw new Error(`Method read() is not implemented on ${this.constructor.name}`);
  }
}

module.exports = Type;
