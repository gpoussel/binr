"use strict";

const BufferWrapper = require("./lib/buffer-wrapper");
const Environment = require("./lib/environment");
const ExpressionEvaluator = require("./lib/expression-evaluator");
const FunctionScope = require("./lib/function-scope");
const StreamObject = require("./lib/stream-object");
const UtilsObject = require("./lib/utils-object");
const ValueAggregator = require("./lib/value-aggregator");
const VariableScope = require("./lib/variable-scope");

module.exports = {
  BufferWrapper,
  Environment,
  ExpressionEvaluator,
  FunctionScope,
  StreamObject,
  UtilsObject,
  ValueAggregator,
  VariableScope,
};
