import { FunctionScope } from "./function-scope";
import { UtilsObject } from "./utils-object";
import { VariableScope } from "./variable-scope";

export class Environment {
  private stream: any;
  private variables: VariableScope;
  private functions: FunctionScope;

  constructor(stream, variables?, functions?) {
    this.stream = stream;
    this.variables = variables || new VariableScope();
    this.functions = functions || new FunctionScope();
  }

  public nestedScope() {
    return new Environment(this.stream, new VariableScope(this.variables), this.functions);
  }

  public get utils(): UtilsObject {
    return new UtilsObject();
  }
}
