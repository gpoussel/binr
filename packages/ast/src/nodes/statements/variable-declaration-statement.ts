import { forEach } from "lodash";

import { EvaluationContext, EvaluationInput, EvaluationResult } from "../../evaluation";
import { AstVisitor } from "../../visitor";
import { Annotation } from "../annotation";
import { Expression } from "../expressions";
import { StructReferenceType, Type } from "../types";
import { VariableDeclaration } from "../variable-declaration";
import { VariableModifier } from "../variable-modifier";
import { Statement } from "./statement";

export class VariableDeclarationStatement extends Statement {
  public constructor(
    private _variableType: Type,
    private _modifiers: VariableModifier[],
    private _bitfield: Expression | undefined,
    private _variableDeclarations: VariableDeclaration[],
    private _annotations: Annotation[],
  ) {
    super();
  }

  public get variableType(): Type {
    return this._variableType;
  }

  public get modifiers(): VariableModifier[] {
    return this._modifiers;
  }

  public get bitfield(): Expression | undefined {
    return this._bitfield;
  }

  public get variableDeclarations(): VariableDeclaration[] {
    return this._variableDeclarations;
  }

  public get annotations(): Annotation[] {
    return this._annotations;
  }

  public evaluate(context: EvaluationContext, input: EvaluationInput): EvaluationResult {
    if (this._variableType instanceof StructReferenceType) {
      const structureName = this._variableType.name;
      const structure = context.getStructure(structureName);
      if (!structure) {
        throw new Error(`Invalid reference to structure '${structureName}: the structure does not exist`);
      }
      forEach(this._variableDeclarations, (variableDeclaration) => {
        // The reference type has to be read for every variable declaration
        const variableContext = context.subContext();
        if (variableDeclaration.typeArguments.length !== structure.parameters.length) {
          throw new Error(
            `Invalid number of arguments for structure ${structureName} while declaring ${variableDeclaration.name}`,
          );
        }
        // TODO Add arguments to the context
        context.declareVariable(variableDeclaration.name, structure.read(variableContext, input));
      });
    } else {
      throw new Error(`Unsupported operation (yet!)`);
    }
    // Nothing to do
    return {};
  }

  protected accept0(visitor: AstVisitor): void {
    if (visitor.visitVariableDeclarationStatement(this)) {
      this._variableType.accept(visitor);
      this._bitfield?.accept(visitor);
      this._variableDeclarations.map((s) => s.accept(visitor));
      this._annotations.map((s) => s.accept(visitor));
    }
    visitor.endVisitVariableDeclarationStatement(this);
  }
}
