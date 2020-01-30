import { CaseSwitchElement } from "../case-switch-element";
import { Expression } from "../expressions";
import { Statement } from "./statement";

export class SwitchStatement extends Statement {
  public constructor(private _testExpression: Expression, private _caseSwitchElements: CaseSwitchElement[]) {
    super();
  }

  public get testExpression(): Expression {
    return this._testExpression;
  }

  public get caseSwitchElements(): CaseSwitchElement[] {
    return this._caseSwitchElements;
  }
}
