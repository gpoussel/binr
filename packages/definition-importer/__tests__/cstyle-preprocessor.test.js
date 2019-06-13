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
});
