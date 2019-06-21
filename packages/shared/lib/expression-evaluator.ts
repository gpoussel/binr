import { createContext, runInNewContext } from "vm";

export class ExpressionEvaluator {
  public evaluate(code: string, env: { [key: string]: any }) {
    const globalObject = createContext({
      env,
    });
    return runInNewContext(code, globalObject);
  }
}
