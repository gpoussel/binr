export class EvaluationContext {
  public constructor(private _parentContext?: EvaluationContext | undefined) {}

  public hasVariable(name: string): boolean {
    return this.hasLocalVariable(name) || !!this._parentContext?.hasVariable(name);
  }

  public subContext(): EvaluationContext {
    return new EvaluationContext(this);
  }

  private hasLocalVariable(_name: string) {
    // TODO Check if variable exists in local scope
    return false;
  }
}
