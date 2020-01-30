import { Type } from "./type";

export class StructReferenceType extends Type {
  public constructor(private _name: string) {
    super();
  }

  public get name(): string {
    return this._name;
  }
}
