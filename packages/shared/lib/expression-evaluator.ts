"use strict";

import vm from "vm";

export class ExpressionEvaluator {
  public evaluate(code, env) {
    const globalObject = vm.createContext({
      env,
    });
    return vm.runInNewContext(code, globalObject);
  }
}
