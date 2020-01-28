import { Statement } from "./statement";
import { CaseSwitchElement } from "./case-switch-element";

export class SwitchStatement extends Statement {
  private _caseSwitchElements: CaseSwitchElement[];

  public constructor(caseSwitchElements: CaseSwitchElement[]) {
    super();
    this._caseSwitchElements = caseSwitchElements;
  }

  public get caseSwitchElements(): CaseSwitchElement[] {
    return this._caseSwitchElements;
  }
}
