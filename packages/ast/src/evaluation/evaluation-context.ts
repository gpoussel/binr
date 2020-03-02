import { find } from "lodash";

import { StructDeclarationStatement } from "../nodes";

export class EvaluationContext {
  private _structures: StructDeclarationStatement[] = [];
  private _variables: { name: string; value: any }[] = []; // TODO Get an appropriate type

  public constructor(private _parentContext?: EvaluationContext | undefined) {}

  public hasVariable(name: string): boolean {
    return this.hasLocalVariable(name) || !!this._parentContext?.hasVariable(name);
  }

  public hasStructure(name: string): boolean {
    return !!this.getStructure(name);
  }

  public declareStructure(statement: StructDeclarationStatement): void {
    if (this.hasStructure(statement.name)) {
      throw new Error(`Structure ${statement.name} already exists`);
    }
    this._structures.push(statement);
  }

  public declareVariable(name: string, value: any): void {
    if (this.hasVariable(name)) {
      throw new Error(`Variable ${name} already exists`);
    }
    this._variables.push({ name, value });
  }

  public getStructure(name: string): StructDeclarationStatement | undefined {
    const localStructure = find(this._structures, (structure) => structure.name === name);
    return localStructure || this._parentContext?.getStructure(name);
  }

  public subContext(): EvaluationContext {
    return new EvaluationContext(this);
  }

  private hasLocalVariable(name: string) {
    return !!find(this._variables, (variable) => variable.name === name);
  }
}
