"use strict";

const _ = require("lodash");

class UtilsObject {
  min(...args) {
    return _.min(args);
  }

  max(...args) {
    return _.max(args);
  }

  abs(arg) {
    return Math.abs(arg);
  }

  ceil(arg) {
    return Math.ceil(arg);
  }

  floor(arg) {
    return Math.floor(arg);
  }

  round(arg) {
    return Math.round(arg);
  }

  random(arg) {
    return Math.floor(Math.random() * (arg + 1));
  }

  pow(number, exp) {
    return number ** exp;
  }

  sqrt(arg) {
    return Math.sqrt(arg);
  }

  exp(arg) {
    return Math.exp(arg);
  }

  log(arg) {
    return Math.log(arg);
  }

  cos(arg) {
    return Math.cos(arg);
  }

  sin(arg) {
    return Math.sin(arg);
  }

  tan(arg) {
    return Math.tan(arg);
  }
}

module.exports = UtilsObject;
