import { Statement } from "./statement";
import { ArraySelector } from "./array-selector";
import { Type } from "./type";
import { Annotation } from "./annotation";

export class TypedefStatement extends Statement {
  private _type: Type;
  private _alias: string;
  private _arraySelector: ArraySelector;
  private _annotations: Annotation[];

  public constructor(type: Type, alias: string, arraySelector: ArraySelector, annotations: Annotation[]) {
    super();
    this._type = type;
    this._alias = alias;
    this._arraySelector = arraySelector;
    this._annotations = annotations;
  }

  public get type(): Type {
    return this._type;
  }

  public get alias(): string {
    return this._alias;
  }

  public get arraySelector(): ArraySelector {
    return this._arraySelector;
  }

  public get annotations(): Annotation[] {
    return this._annotations;
  }
}
