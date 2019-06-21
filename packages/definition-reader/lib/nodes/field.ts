import { FieldStatement } from "@binr/model";
import { filter, fromPairs, get, has, includes, isUndefined, map } from "lodash";
import { ExpressionConverter } from "../expression-converter";
import {
  ArrayType,
  ArrayUntilType,
  BitmaskType,
  builtInTypes,
  CharArrayType,
  EnumerationType,
  StructureType,
} from "../types";
import { Node } from "./node";

const getBuiltInType = (type: any) => (builtInTypes as any)[type.type](type);

export class FieldNode extends Node {
  public name: any;
  private type: any;
  private annotations: any;
  private converter: ExpressionConverter;
  private arrayDefinition: string | undefined;
  private arrayUntilDefinition: string | undefined;
  constructor(type: any, name: string, annotations?: any[]) {
    super();
    this.type = type;
    this.name = name;
    this.annotations = annotations;
    this.converter = new ExpressionConverter();
  }

  public setArrayDefinition(arrayDefinition: string) {
    this.arrayDefinition = arrayDefinition;
  }

  public setArrayUntilDefinition(arrayUntilDefinition: string) {
    this.arrayUntilDefinition = arrayUntilDefinition;
  }

  public buildStatement(builtElements: any) {
    const typeName = this.type.type;
    let type;
    if (has(builtInTypes, typeName)) {
      type = getBuiltInType(this.type);
    } else if (has(builtElements.structures, typeName)) {
      type = new StructureType(get(builtElements.structures, typeName));
    } else if (has(builtElements.enumerations, typeName)) {
      const enumeration = get(builtElements.enumerations, typeName);
      type = new EnumerationType(getBuiltInType(enumeration.parentType), enumeration);
    } else {
      const bitmask = get(builtElements.bitmasks, typeName);
      if (isUndefined(bitmask)) {
        throw new Error(`Bad type: ${typeName}`);
      }
      type = new BitmaskType(getBuiltInType(bitmask.parentType), bitmask);
    }
    if (has(this, "arrayDefinition")) {
      const definitionCode = this.converter.transformCodeToFunction(this.arrayDefinition!);
      type = new ArrayType(type, definitionCode);
      if (includes(["char", "wchar"], typeName)) {
        // Special case for array of characters, that shall be read as strings
        type = new CharArrayType(type);
      }
    }
    if (has(this, "arrayUntilDefinition")) {
      const definitionCode = this.converter.transformCodeToFunction(this.arrayUntilDefinition!);
      type = new ArrayUntilType(type, definitionCode);
    }
    return new FieldStatement(
      this.name,
      type,
      fromPairs(
        map(filter(this.annotations, (annotation) => annotation.name === "ignore"), (annotation) => {
          return ["ignore", annotation.value];
        }),
      ),
    );
  }

  public getTypes() {
    return [this.type];
  }
}
