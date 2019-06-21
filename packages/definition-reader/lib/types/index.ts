import { CharType } from "./char";
import { CStringType } from "./cstring";
import { DoubleType } from "./double";
import { IntType } from "./int";
import { UintType } from "./uint";
import { WCharType } from "./wchar";

export const builtInTypes = {
  char: () => new CharType(),
  cstring: () => new CStringType(),
  double: () => new DoubleType(),
  int: (type: any) => new IntType(type.typeRestriction),
  uint: (type: any) => new UintType(type.typeRestriction),
  wchar: () => new WCharType(),
};

export { CharType, CStringType, DoubleType, IntType, UintType, WCharType };
export * from "./array-until";
export * from "./array";
export * from "./bitmask";
export * from "./char-array";
export * from "./double";
export * from "./enumeration";
export * from "./int";
export * from "./structure";
export * from "./type";
export * from "./uint";
export * from "./wchar";
