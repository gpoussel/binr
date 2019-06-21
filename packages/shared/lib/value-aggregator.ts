import { clone } from "lodash";

export class ValueAggregator {
  private value: { [key: string]: any };

  constructor() {
    this.value = {};
  }

  public set(key: string, value: any) {
    this.value[key] = value;
  }

  public build() {
    return clone(this.value);
  }
}
