import { FunctionScope } from "./function-scope";
import { UtilsObject } from "./utils-object";
import { VariableScope } from "./variable-scope";

export class Environment {

  public get utils(): UtilsObject {
    return new UtilsObject();
  }
  public variables: VariableScope;
  public functions: FunctionScope;
  private stream: any;

  constructor(stream: any, variables?: VariableScope, functions?: FunctionScope) {
    this.stream = stream;
    this.variables = variables || new VariableScope();
    this.functions = functions || new FunctionScope();
  }

  public nestedScope() {
    return new Environment(this.stream, new VariableScope(this.variables), this.functions);
  }
}
