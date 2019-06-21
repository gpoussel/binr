import { max, min } from "lodash";

export class UtilsObject {
  public min(...args) {
    return min(args);
  }

  public max(...args) {
    return max(args);
  }

  public abs(arg) {
    return Math.abs(arg);
  }

  public ceil(arg) {
    return Math.ceil(arg);
  }

  public floor(arg) {
    return Math.floor(arg);
  }

  public round(arg) {
    return Math.round(arg);
  }

  public random(arg) {
    return Math.floor(Math.random() * (arg + 1));
  }

  public pow(operand, exp) {
    return operand ** exp;
  }

  public sqrt(arg) {
    return Math.sqrt(arg);
  }

  public exp(arg) {
    return Math.exp(arg);
  }

  public log(arg) {
    return Math.log(arg);
  }

  public cos(arg) {
    return Math.cos(arg);
  }

  public sin(arg) {
    return Math.sin(arg);
  }

  public tan(arg) {
    return Math.tan(arg);
  }
}
