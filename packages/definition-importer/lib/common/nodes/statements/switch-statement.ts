import { CaseSwitchElement } from "../case-switch-element";
import { Statement } from "./statement";

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
