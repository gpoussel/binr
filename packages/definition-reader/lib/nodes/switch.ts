import { BlockStatement, IfStatement } from "@binr/model";
import { flatMap, forEachRight, isEmpty, isString } from "lodash";
import { ExpressionConverter } from "../expression-converter";
import { Node } from "./node";

export class SwitchNode extends Node {
  private test: any;
  private clauses: any;
  private converter: ExpressionConverter;
  constructor(test, clauses) {
    super();
    this.test = test;
    this.clauses = clauses;
    this.converter = new ExpressionConverter();
  }

  public buildStatement(builtElements) {
    if (isEmpty(this.clauses)) {
      // That's an empty switch, so convert it to a block statement without content
      return new BlockStatement([]);
    }
    let currentStatement;
    forEachRight(this.clauses, (clause) => {
      const statement = clause.statement.buildStatement(builtElements);
      const testCondition = this.getTestCondition(clause.value);
      currentStatement = new IfStatement(testCondition, statement, currentStatement);
    });
    return currentStatement;
  }

  public getTypes() {
    return flatMap(this.clauses, (clause) => clause.statement.getTypes());
  }

  public getTestCondition(value) {
    const transformedValue = isString(value) ? `"${value}"` : value;
    return this.converter.transformCodeToFunction(`${this.test} === ${transformedValue}`);
  }
}
