import { ValueExpression } from "./expressions";
import { Node } from "./node";
import { Statement } from "./statements";

export abstract class SwitchLabel extends Node {
  public constructor() {
    super();
  }
}

export class DefaultSwitchLabel extends SwitchLabel {
  public constructor() {
    super();
  }
}

export class ValueSwitchLabel extends SwitchLabel {
  public constructor(private _value: ValueExpression) {
    super();
  }

  public get value(): ValueExpression {
    return this._value;
  }
}

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
