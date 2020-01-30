import { BufferWrapper, Environment, ValueAggregator } from "@binr/shared";
import { get } from "lodash";

import { Statement } from "./statement";

export class FieldStatement extends Statement {
  public type: any;
  private name: string;
  private meta: any;

  constructor(name: string, type: any, meta: any) {
    super();
    this.name = name;
    this.type = type;
    this.meta = meta;
  }

  public read(buffer: BufferWrapper, environment: Environment, valueAggregator: ValueAggregator) {
    const readValue = this.type.read(buffer, environment);
    const ignore = get(this.meta, "ignore", false);
    if (!ignore) {
      valueAggregator.set(this.name, readValue);
      environment.variables.put(this.name, readValue);
    }
  }
}
