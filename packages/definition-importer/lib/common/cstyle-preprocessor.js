const _ = require("lodash");

class CStylePreprocessor {
  preprocess(input) {
    const lines = [];
    const definitions = {};
    const conditionStack = [];

    const replaceDefinitions = inputLine => {
      let updatedLine = inputLine;
      _.each(definitions, (value, key) => {
        updatedLine = updatedLine.replace(new RegExp(`\\b${key}\\b`, "g"), value);
      });
      return updatedLine;
    };

    _.each(_.split(input, /\r?\n/), line => {
      if (line.match(/^[ \t]*#.*$/)) {
        // This line is a directive and will never be in the output
        const [directiveName, firstArgument, ...otherArguments] = _.split(_.trim(line), /\s+/);
        if (directiveName === "#define") {
          if (!_.isUndefined(definitions[firstArgument])) {
            throw new Error(`Macro ${firstArgument} was already defined`);
          }
          const content = _.join(otherArguments, " ");
          // Unfortunately, there is an edge case where the content has a comment inside
          const contentWithoutComment = content.replace(new RegExp("\\s*//.*$"), "");
          definitions[firstArgument] = replaceDefinitions(contentWithoutComment);
        } else if (directiveName === "#ifdef") {
          conditionStack.push({ positive: true, variable: firstArgument });
        } else if (directiveName === "#else") {
          if (_.isEmpty(conditionStack)) {
            throw new Error("Cannot use #else outside #ifdef");
          }
          _.last(conditionStack).positive = false;
        } else if (directiveName === "#endif") {
          conditionStack.pop();
        } else {
          // Don't care, just skip that directive
        }
      } else {
        const conditionMatch = _.every(
          conditionStack,
          condition => _.has(definitions, condition.variable) === condition.positive
        );
        if (conditionMatch) {
          lines.push(replaceDefinitions(line));
        }
      }
    });
    return _.join(lines, "\n");
  }
}

module.exports = CStylePreprocessor;
