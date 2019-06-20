"use strict";

import { CharType } from "./char";
import { CStringType } from "./cstring";
import { DoubleType } from "./double";
import { IntType } from "./int";
import { UintType } from "./uint";
import { WCharType } from "./wchar";

export const builtInTypes = {
  char: (type) => new CharType(type.typeRestriction),
  cstring: (type) => new CStringType(type.typeRestriction),
  double: () => new DoubleType(),
  int: (type) => new IntType(type.typeRestriction),
  uint: (type) => new UintType(type.typeRestriction),
  wchar: (type) => new WCharType(type.typeRestriction),
};

export { CharType, CStringType, DoubleType, IntType, UintType, WCharType };
export * from "./array";
export * from "./array-until";
export * from "./bitmask";
export * from "./char-array";
export * from "./double";
export * from "./enumeration";
export * from "./int";
export * from "./structure";
export * from "./uint";
export * from "./wchar";
