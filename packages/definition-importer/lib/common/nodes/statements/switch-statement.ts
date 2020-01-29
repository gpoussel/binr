import { CaseSwitchElement } from "../case-switch-element";
import { Statement } from "./statement";

export class SwitchStatement extends Statement {
  public constructor(private _caseSwitchElements: CaseSwitchElement[]) {
    super();
  }

  public get caseSwitchElements(): CaseSwitchElement[] {
    return this._caseSwitchElements;
  }
}
