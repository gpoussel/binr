import * as assert from "assert";
import { get, has } from "lodash";

export class FunctionScope {
  private functions: { [key: string]: () => void };

  constructor() {
    this.functions = {};
  }

  public get(name: string) {
    if (has(this.functions, name)) {
      return get(this.functions, name);
    }
    throw new Error(`Undefined function ${name} in scope`);
  }

  public put(name: string, value: () => void) {
    assert(!has(this.functions, name), `Function named '${name}' is already present in scope`);
    this.functions[name] = value;
  }
}
