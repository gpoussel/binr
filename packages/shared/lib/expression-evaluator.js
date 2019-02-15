"use strict";

const vm = require("vm");

class ExpressionEvaluator {
  evaluate(code, env) {
    const globalObject = vm.createContext({
      env,
    });
    return vm.runInNewContext(code, globalObject);
  }
}

module.exports = ExpressionEvaluator;
