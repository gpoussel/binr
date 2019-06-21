import { clone } from "lodash";

export class ValueAggregator {
  private value: {};

  constructor() {
    this.value = {};
  }

  public set(key, value) {
    this.value[key] = value;
  }

  public build() {
    return clone(this.value);
  }
}
