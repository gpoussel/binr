import _ from "lodash";

import { Statement } from "./statement";

export class FieldStatement extends Statement {
  private name: string;
  private type: any;
  private meta: any;

  constructor(name, type, meta) {
    super();
    this.name = name;
    this.type = type;
    this.meta = meta;
  }

  public read(buffer, environment, valueAggregator) {
    const readValue = this.type.read(buffer, environment);
    const ignore = _.get(this.meta, "ignore", false);
    if (!ignore) {
      valueAggregator.set(this.name, readValue);
      environment.variables.put(this.name, readValue);
    }
  }
}
