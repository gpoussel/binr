import { EvaluationContext } from "../evaluation";
import { AstVisitor } from "../visitor";

export abstract class Node {
  public accept(visitor: AstVisitor): void {
    debugger;
    visitor.preVisit(this);
    this.accept0(visitor);
    visitor.postVisit(this);
  }

  protected abstract accept0(visitor: AstVisitor): void;
  protected abstract evaluate(context: EvaluationContext): void;
}
