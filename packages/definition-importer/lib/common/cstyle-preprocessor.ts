import { each, every, has, isEmpty, isUndefined, join, last, split, trim } from "lodash";

export class CStylePreprocessor {
  public preprocess(input) {
    const lines = [];
    const definitions = {};
    const conditionStack = [];

    const replaceDefinitions = (inputLine) => {
      let updatedLine = inputLine;
      each(definitions, (value, key) => {
        updatedLine = updatedLine.replace(new RegExp(`\\b${key}\\b`, "g"), value);
      });
      return updatedLine;
    };

    each(split(input, /\r?\n/), (line) => {
      if (line.match(/^[ \t]*#.*$/)) {
        // This line is a directive and will never be in the output
        const [directiveName, firstArgument, ...otherArguments] = split(trim(line), /\s+/);
        if (directiveName === "#define") {
          if (!isUndefined(definitions[firstArgument])) {
            throw new Error(`Macro ${firstArgument} was already defined`);
          }
          const content = join(otherArguments, " ");
          // Unfortunately, there is an edge case where the content has a comment inside
          const contentWithoutComment = content.replace(new RegExp("\\s*//.*$"), "");
          definitions[firstArgument] = replaceDefinitions(contentWithoutComment);
        } else if (directiveName === "#ifdef") {
          conditionStack.push({ positive: true, variable: firstArgument });
        } else if (directiveName === "#ifndef") {
          conditionStack.push({ positive: false, variable: firstArgument });
        } else if (directiveName === "#else") {
          if (isEmpty(conditionStack)) {
            throw new Error("Cannot use #else outside #ifdef");
          }
          const topCondition = last(conditionStack);
          topCondition.positive = !topCondition.positive;
        } else if (directiveName === "#endif") {
          conditionStack.pop();
        } else {
          // Don't care, just skip that directive
        }
      } else {
        const conditionMatch = every(
          conditionStack,
          (condition) => has(definitions, condition.variable) === condition.positive,
        );
        if (conditionMatch) {
          lines.push(replaceDefinitions(line));
        }
      }
    });
    return join(lines, "\n");
  }
}
