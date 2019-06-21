import { max, min } from "lodash";

export class UtilsObject {
  public min(...args: number[]) {
    return min(args);
  }

  public max(...args: number[]) {
    return max(args);
  }

  public abs(arg: number) {
    return Math.abs(arg);
  }

  public ceil(arg: number) {
    return Math.ceil(arg);
  }

  public floor(arg: number) {
    return Math.floor(arg);
  }

  public round(arg: number) {
    return Math.round(arg);
  }

  public random(arg: number) {
    return Math.floor(Math.random() * (arg + 1));
  }

  public pow(operand: number, exp: number) {
    return operand ** exp;
  }

  public sqrt(arg: number) {
    return Math.sqrt(arg);
  }

  public exp(arg: number) {
    return Math.exp(arg);
  }

  public log(arg: number) {
    return Math.log(arg);
  }

  public cos(arg: number) {
    return Math.cos(arg);
  }

  public sin(arg: number) {
    return Math.sin(arg);
  }

  public tan(arg: number) {
    return Math.tan(arg);
  }
}
