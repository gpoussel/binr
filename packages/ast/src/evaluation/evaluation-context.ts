export class EvaluationContext {
  public constructor(private _parentContext?: EvaluationContext | undefined) {}

  public subContext(): EvaluationContext {
    return new EvaluationContext(this);
  }
}
