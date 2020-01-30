import { ValueExpression } from "./value-expression";

export class IdentifierValueExpression extends ValueExpression {
  public constructor(private _name: string) {
    super();
  }

  public get name() {
    return this._name;
  }
}
