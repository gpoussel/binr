"use strict";

import { FunctionScope } from "./function-scope";
import { UtilsObject } from "./utils-object";
import { VariableScope } from "./variable-scope";

export class Environment {
  private stream: any;
  private variables: VariableScope;
  private functions: FunctionScope;
  private utils: UtilsObject = new UtilsObject();

  constructor(stream, variables, functions) {
    this.stream = stream;
    this.variables = variables || new VariableScope();
    this.functions = functions || new FunctionScope();
  }

  public nestedScope() {
    return new Environment(this.stream, new VariableScope(this.variables), this.functions);
  }
}
