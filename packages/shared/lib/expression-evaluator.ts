import { createContext, runInNewContext } from "vm";

export class ExpressionEvaluator {
  public evaluate(code, env) {
    const globalObject = createContext({
      env,
    });
    return runInNewContext(code, globalObject);
  }
}
