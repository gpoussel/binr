import { forEach } from "lodash";

import { EvaluationContext, EvaluationInput, EvaluationResult } from "../evaluation";
import { AstVisitor } from "../visitor";
import { Annotation } from "./annotation";
import { Node } from "./node";
import { Statement } from "./statements/statement";

export class Definition extends Node {
  public constructor(private _statements: Statement[], private _annotations: Annotation[]) {
    super();
  }

  public get statements(): Statement[] {
    return this._statements;
  }

  public get annotations(): Annotation[] {
    return this._annotations;
  }

  public evaluate(context: EvaluationContext, input: EvaluationInput): EvaluationResult {
    forEach(this._statements, (statement) => {
      statement.evaluate(context, input);
    });
    // TODO Return something useful
    return {};
  }

  protected accept0(visitor: AstVisitor): void {
    if (visitor.visitDefinition(this)) {
      this._annotations.map((s) => s.accept(visitor));
      this._statements.map((s) => s.accept(visitor));
    }
    visitor.endVisitDefinition(this);
  }
}
