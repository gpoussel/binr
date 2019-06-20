"use strict";

const CStylePreprocessor = require("../lib/common/cstyle-preprocessor");

describe("C-Style preprocessor", () => {
  const preprocessor = new CStylePreprocessor();
  test("removes all unknown #-prefixed lines", () => {
    const input = `a
#define A 1
b
#invalid a
c`;
    const result = preprocessor.preprocess(input);
    expect(result).toEqual(`a
b
c`);
  });

  test("strips spaces before # into account", () => {
    const input = `a
    #define A 1
b
\t\t#define B 2
c`;
    const result = preprocessor.preprocess(input);
    expect(result).toEqual(`a
b
c`);
  });

  test("replaces #define", () => {
    const input = `#define A a
A
b
AA
Aa
define(A)
A_B
c`;
    const result = preprocessor.preprocess(input);
    expect(result).toEqual(`a
b
AA
Aa
define(a)
A_B
c`);
  });

  test("supports #ifdef #endif", () => {
    const input = `#define A
#ifdef A
B
#endif
C`;
    const result = preprocessor.preprocess(input);
    expect(result).toEqual(`B
C`);
  });

  test("supports #ifdef #else #endif", () => {
    const input = `#define A
#ifdef A
B
#else
D
#endif
#ifdef B
D
#else
C
#endif`;
    const result = preprocessor.preprocess(input);
    expect(result).toEqual(`B
C`);
  });

  test("handles duplicated #define", () => {
    const input = `#define A a
#define A a
A`;
    expect(() => preprocessor.preprocess(input)).toThrow(/already defined/);
  });

  test("handles invalid #else", () => {
    const input = `#else foo
A
#endif`;
    expect(() => preprocessor.preprocess(input)).toThrow(/#else/);
  });

  test("handles escaped line breaks", () => {
    const input = `#define A a+\
b \
c
A`;
    expect(preprocessor.preprocess(input)).toEqual("a+b c");
  });

  test("handles constants in constants", () => {
    const input = `#define A a
#define ADDITION A+A
ADDITION`;
    expect(preprocessor.preprocess(input)).toEqual("a+a");
  });

  test("supports #ifndef #else #endif", () => {
    const input = `#define A
#ifndef A
B
#else
D
#endif
#ifndef B
D
#else
C
#endif`;
    const result = preprocessor.preprocess(input);
    expect(result).toEqual(`D
D`);
  });
});
