import _ from "lodash";

import { Type } from "./type";

export class CharArrayType extends Type {
  private arrayType: any;
  constructor(arrayType) {
    super();
    this.arrayType = arrayType;
  }

  public read(buffer, environment) {
    return _.join(this.arrayType.read(buffer, environment), "");
  }
}
