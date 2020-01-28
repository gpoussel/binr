import { Node } from "./node";
import { SwitchLabel } from "./switch-label";
import { Statement } from ".";

export class CaseSwitchElement extends Node {
  private _labels: SwitchLabel[];
  private _statements: Statement[];

  public constructor(labels: SwitchLabel[], statements: Statement[]) {
    super();
    this._labels = labels;
    this._statements = statements;
  }

  public get labels(): SwitchLabel[] {
    return this._labels;
  }

  public get statements(): Statement[] {
    return this._statements;
  }
}
