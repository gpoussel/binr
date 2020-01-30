import { Node } from "./node";
import { Statement } from "./statements";
import { SwitchLabel } from "./switch-label";

export class CaseSwitchElement extends Node {
  public constructor(private _labels: SwitchLabel[], private _statements: Statement[]) {
    super();
  }

  public get labels(): SwitchLabel[] {
    return this._labels;
  }

  public get statements(): Statement[] {
    return this._statements;
  }
}
