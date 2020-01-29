import { each, every, has, isEmpty, isUndefined, join, last, split } from "lodash";

interface ICondition {
  positive: boolean;
  variable: string;
}

export class CStylePreprocessor {
  public preprocess(input: string) {
    const lines: string[] = [];
    const definitions: { [key: string]: string } = {};
    const conditionStack: ICondition[] = [];
    let inDefinition = false;
    let currentDefinition = { name: "", content: "" };

    each(split(input, /\r?\n/), (line) => {
      if (inDefinition) {
        // Multi-line definition, need to check if the definition is complete
        if (line.endsWith("\\")) {
          currentDefinition.content += line.substring(0, line.length - 1) + "\n";
          // On-going definition
        } else {
          definitions[currentDefinition.name] = this.replaceDefinitions(
            definitions,
            currentDefinition.content + line,
          );
          currentDefinition = { name: "", content: "" };
          inDefinition = false;
        }
        lines.push("");
      } else if (line.match(/^[ \t]*#.*$/)) {
        // This line is a directive and will never be in the output
        const [directiveName, firstArgument, secondArgument] = this.readDirective(line);
        if (directiveName === "#define") {
          if (!isUndefined(definitions[firstArgument])) {
            throw new Error(`Macro ${firstArgument} was already defined`);
          }
          if (secondArgument.endsWith("\\")) {
            currentDefinition.name = firstArgument;
            currentDefinition.content = secondArgument.substring(0, secondArgument.length - 1) + "\n";
            inDefinition = true;
          } else {
            definitions[firstArgument] = this.replaceDefinitions(definitions, secondArgument);
            currentDefinition = { name: "", content: "" };
            inDefinition = false;
          }
        } else if (directiveName === "#ifdef") {
          conditionStack.push({ positive: true, variable: firstArgument });
        } else if (directiveName === "#ifndef") {
          conditionStack.push({ positive: false, variable: firstArgument });
        } else if (directiveName === "#else") {
          if (isEmpty(conditionStack)) {
            throw new Error("Cannot use #else outside #ifdef");
          }
          const topCondition = last(conditionStack)!;
          topCondition.positive = !topCondition.positive;
        } else if (directiveName === "#endif") {
          conditionStack.pop();
        } else {
          // Don't care, just skip that directive
        }
        // Add an empty line, so line numbers match
        lines.push("");
      } else {
        const conditionMatch = every(
          conditionStack,
          (condition) => has(definitions, condition.variable) === condition.positive,
        );
        if (conditionMatch) {
          lines.push(this.replaceDefinitions(definitions, line));
        } else {
          lines.push("");
        }
      }
    });
    return join(lines, "\n");
  }
  private replaceDefinitions(definitions: {}, inputLine: string): string {
    let updatedLine = inputLine;
    each(definitions, (value: string, key) => {
      updatedLine = updatedLine.replace(new RegExp(`\\b${key}\\b`, "g"), value.replace(/\n/g, ""));
    });
    return updatedLine;
  }
  private readDirective(line: string) {
    let state = 0;
    let i = 0;
    let firstWord = "";
    let secondWord = "";
    let rest = "";
    while (i < line.length) {
      const char = line.charAt(i);
      const space = char === " " || char === "\t" || char === "\n" || char === "\r";
      if (state === 0) {
        if (space) {
          state = 1;
        } else {
          firstWord += char;
        }
      } else if (state === 1) {
        if (!space) {
          secondWord += char;
          state = 2;
        }
      } else if (state === 2) {
        if (space) {
          state = 3;
        } else {
          secondWord += char;
        }
      } else if (state === 3) {
        rest += char;
      }
      ++i;
    }
    const commentStart = rest.indexOf("//");
    if (commentStart >= 0) {
      // Remove the comment
      rest = rest.substring(0, commentStart);
    }
    return [firstWord, secondWord, rest];
  }
}
