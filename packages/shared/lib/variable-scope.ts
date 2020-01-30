import * as assert from "assert";

import { get, has, isUndefined } from "lodash";

export class VariableScope {
  private parentScope: VariableScope | undefined;
  private variables: { [key: string]: any };

  constructor(parentScope?: VariableScope) {
    this.parentScope = parentScope;
    this.variables = {};
  }

  public get(name: string): any {
    if (has(this.variables, name)) {
      return get(this.variables, name);
    }
    if (!isUndefined(this.parentScope)) {
      return this.parentScope!.get(name);
    }
    throw new Error(`Undefined variable ${name} in the current scope`);
  }

  public put(name: string, value: any) {
    assert(!has(this.variables, name), `Variable named '${name}' is already present in current scope`);
    this.variables[name] = value;
  }
}
