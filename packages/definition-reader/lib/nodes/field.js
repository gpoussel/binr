"use strict";

const _ = require("lodash");
const { FieldStatement } = require("@binr/model");
const ExpressionConverter = require("../expression-converter");
const Node = require("./node");
const {
  builtInTypes,
  StructureType,
  EnumerationType,
  BitmaskType,
  ArrayType,
  CharArrayType,
  ArrayUntilType,
} = require("../types");

const getBuiltInType = type => builtInTypes[type.type](type);

class FieldNode extends Node {
  constructor(type, name, annotations) {
    super();
    this.type = type;
    this.name = name;
    this.annotations = annotations;
    this.converter = new ExpressionConverter();
  }

  setArrayDefinition(arrayDefinition) {
    this.arrayDefinition = arrayDefinition;
  }

  setArrayUntilDefinition(arrayUntilDefinition) {
    this.arrayUntilDefinition = arrayUntilDefinition;
  }

  buildStatement(builtElements) {
    const typeName = this.type.type;
    let type;
    if (_.has(builtInTypes, typeName)) {
      type = getBuiltInType(this.type);
    } else if (_.has(builtElements.structures, typeName)) {
      type = new StructureType(_.get(builtElements.structures, typeName));
    } else if (_.has(builtElements.enumerations, typeName)) {
      const enumeration = _.get(builtElements.enumerations, typeName);
      type = new EnumerationType(getBuiltInType(enumeration.parentType), enumeration);
    } else {
      const bitmask = _.get(builtElements.bitmasks, typeName);
      if (_.isUndefined(bitmask)) {
        throw new Error(`Bad type: ${typeName}`);
      }
      type = new BitmaskType(getBuiltInType(bitmask.parentType), bitmask);
    }
    if (_.has(this, "arrayDefinition")) {
      const definitionCode = this.converter.transformCodeToFunction(this.arrayDefinition);
      type = new ArrayType(type, definitionCode);
      if (_.includes(["char", "wchar"], typeName)) {
        // Special case for array of characters, that shall be read as strings
        type = new CharArrayType(type);
      }
    }
    if (_.has(this, "arrayUntilDefinition")) {
      const definitionCode = this.converter.transformCodeToFunction(this.arrayUntilDefinition);
      type = new ArrayUntilType(type, definitionCode);
    }
    return new FieldStatement(
      this.name,
      type,
      _.fromPairs(
        _.map(this.annotations, annotation => {
          if (annotation.name === "ignore") {
            return ["ignore", annotation.value];
          }
        }).filter(pair => pair[0])
      )
    );
  }

  getTypes() {
    return [this.type];
  }
}

module.exports = FieldNode;
