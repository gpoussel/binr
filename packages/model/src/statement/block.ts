import { each } from "lodash";

import { BufferWrapper, Environment, ValueAggregator } from "@binr/shared";
import { Statement } from "./statement";

export class BlockStatement extends Statement {
  private innerStatements: Statement[];

  constructor(innerStatements: Statement[]) {
    super();
    this.innerStatements = innerStatements;
  }

  public read(buffer: BufferWrapper, environment: Environment, valueAggregator: ValueAggregator) {
    each(this.innerStatements, (s) => s.read(buffer, environment, valueAggregator));
  }
}
