import { UtilsObject } from "../lib/utils-object";

describe("UtilsObject", () => {
  const utils = new UtilsObject();

  test("implements min function", () => {
    expect(utils.min(1, 2, 3)).toBe(1);
    expect(utils.min()).toBeUndefined();
  });

  test("implements max function", () => {
    expect(utils.max(1, 2, 3)).toBe(3);
    expect(utils.max()).toBeUndefined();
  });

  test("implements abs function", () => {
    expect(utils.abs(-1)).toBe(1);
    expect(utils.abs(2)).toBe(2);
  });

  test("implements ceil function", () => {
    expect(utils.ceil(1)).toBe(1);
    expect(utils.ceil(0.8)).toBe(1);
  });

  test("implements floor function", () => {
    expect(utils.floor(0.2)).toBe(0);
    expect(utils.floor(0.8)).toBe(0);
  });

  test("implements round function", () => {
    expect(utils.round(0.2)).toBe(0);
    expect(utils.round(0.8)).toBe(1);
  });

  test("implements sqrt function", () => {
    expect(utils.sqrt(9)).toBe(3);
    expect(utils.sqrt(81)).toBe(9);
  });

  test("implements random function", () => {
    expect(utils.random(200)).toBeLessThanOrEqual(200);
    expect(utils.random(0)).toBeLessThanOrEqual(0);
  });

  test("implements pow function", () => {
    expect(utils.pow(10, 5)).toBe(1e5);
    expect(utils.pow(2, 2)).toBe(4);
  });

  test("implements exp function", () => {
    expect(utils.exp(1)).toBe(Math.exp(1));
  });

  test("implements log function", () => {
    expect(utils.log(12)).toBe(Math.log(12));
  });

  test("implements trigonometric functions", () => {
    expect(utils.cos(1)).toEqual(Math.cos(1));
    expect(utils.sin(1)).toEqual(Math.sin(1));
    expect(utils.tan(1)).toEqual(Math.tan(1));
  });
});
