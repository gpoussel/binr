import { CstParser } from "chevrotain";
import { values } from "lodash";

import { tokens } from "./sweetscape-tokens";

export class SweetscapeParser extends CstParser {
  public statement = this.RULE("statement", () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.block) },
      { ALT: () => this.SUBRULE(this.expressionStatement) },
      { ALT: () => this.SUBRULE(this.localVariableDeclarationStatement) },
      { ALT: () => this.SUBRULE(this.typedefStatement) },
      { ALT: () => this.SUBRULE(this.inlineStructStatement) },
      { ALT: () => this.SUBRULE(this.structDeclarationStatement) },
      { ALT: () => this.SUBRULE(this.forwardStructDeclarationStatement) },
      { ALT: () => this.SUBRULE(this.inlineEnumStatement) },
      { ALT: () => this.SUBRULE(this.enumDeclarationStatement) },
      { ALT: () => this.SUBRULE(this.ifStatement) },
      { ALT: () => this.SUBRULE(this.whileStatement) },
      { ALT: () => this.SUBRULE(this.doWhileStatement) },
      { ALT: () => this.SUBRULE(this.forStatement) },
      { ALT: () => this.SUBRULE(this.switchStatement) },
      { ALT: () => this.SUBRULE(this.returnStatement) },
      { ALT: () => this.SUBRULE(this.breakStatement) },
      { ALT: () => this.SUBRULE(this.emptyStatement) },
    ]);
  });

  /**
   * Level 0 precedence: assignment expressions
   */
  public assignmentExpression = this.RULE("assignmentExpression", () => {
    this.SUBRULE(this.ternaryExpression);
    this.MANY(() => {
      this.SUBRULE(this.assignmentOperator);
      this.SUBRULE1(this.ternaryExpression);
    });
  });
  public definition = this.RULE("definition", () => this.MANY(() => this.SUBRULE(this.topLevelStatement)));

  private topLevelStatement = this.RULE("topLevelStatement", () => {
    this.OR({
      DEF: [
        {
          GATE: this.BACKTRACK(this.functionDeclarationStatement),
          ALT: () => this.SUBRULE(this.functionDeclarationStatement),
        },
        {
          GATE: this.BACKTRACK(this.statement),
          ALT: () => this.SUBRULE(this.statement),
        },
      ],
      IGNORE_AMBIGUITIES: true,
    });
  });

  private statementList = this.RULE("statementList", () => this.MANY(() => this.SUBRULE(this.statement)));

  private block = this.RULE("block", () => {
    this.CONSUME(tokens.CurlyBraceOpen);
    this.SUBRULE(this.statementList);
    this.CONSUME(tokens.CurlyBraceClose);
  });

  private functionDeclarationStatement = this.RULE("functionDeclarationStatement", () => {
    this.SUBRULE(this.typeName);
    this.CONSUME1(tokens.Identifier); // Function name
    this.SUBRULE(this.functionParameterDeclarationList);
    this.OR([{ ALT: () => this.SUBRULE(this.block) }, { ALT: () => this.CONSUME(tokens.SemiColon) }]);
  });

  private localVariableDeclarationStatement = this.RULE("localVariableDeclarationStatement", () => {
    this.MANY(() => this.SUBRULE(this.variableModifier));
    this.SUBRULE(this.typeName);
    this.OR([
      { ALT: () => this.SUBRULE(this.variableDeclarators) },
      {
        ALT: () => {
          this.SUBRULE2(this.bitfieldRest);
          this.OPTION(() => this.SUBRULE(this.annotations));
        },
      },
    ]);
    this.CONSUME(tokens.SemiColon);
  });

  private bitfieldRest = this.RULE("bitfieldRest", () => {
    this.CONSUME(tokens.Colon);
    this.SUBRULE(this.additiveExpression);
  });

  private typedefStatement = this.RULE("typedefStatement", () => {
    this.CONSUME(tokens.Typedef);
    this.SUBRULE(this.typeName); // Type
    this.CONSUME3(tokens.Identifier); // Alias
    this.OPTION4(() => this.SUBRULE(this.arraySelector));
    this.OPTION2(() => this.SUBRULE(this.annotations));
    this.CONSUME(tokens.SemiColon);
  });

  private inlineStructStatement = this.RULE("inlineStructStatement", () => {
    this.OR2([{ ALT: () => this.CONSUME(tokens.Struct) }, { ALT: () => this.CONSUME(tokens.Union) }]);
    this.OPTION2(() => this.CONSUME(tokens.Identifier)); // Alias
    this.SUBRULE2(this.structDeclaration);
    this.OPTION4(() => this.SUBRULE(this.variableDeclarator));
    this.CONSUME(tokens.SemiColon);
  });

  private structDeclarationStatement = this.RULE("structDeclarationStatement", () => {
    this.CONSUME(tokens.Typedef);
    this.OR2([{ ALT: () => this.CONSUME(tokens.Struct) }, { ALT: () => this.CONSUME(tokens.Union) }]);
    this.OPTION3(() => this.CONSUME3(tokens.Identifier));
    this.SUBRULE2(this.structDeclaration);
    this.OPTION2(() => this.CONSUME2(tokens.Identifier));
    this.OPTION(() => this.SUBRULE(this.annotations));
    this.CONSUME(tokens.SemiColon);
  });

  private forwardStructDeclarationStatement = this.RULE("forwardStructDeclarationStatement", () => {
    this.CONSUME(tokens.Struct);
    this.CONSUME(tokens.Identifier); // Structure name
    this.CONSUME(tokens.SemiColon);
  });

  private inlineEnumStatement = this.RULE("inlineEnumStatement", () => {
    this.CONSUME(tokens.Enum);
    this.OPTION2(() => {
      this.CONSUME(tokens.Less);
      this.SUBRULE(this.typeName);
      this.CONSUME(tokens.Greater);
    });
    this.OPTION(() => this.CONSUME(tokens.Identifier)); // Alias
    this.SUBRULE2(this.enumDeclaration);
    this.OPTION3(() => this.SUBRULE(this.variableDeclarators));
    this.CONSUME(tokens.SemiColon);
  });

  private enumDeclarationStatement = this.RULE("enumDeclarationStatement", () => {
    this.CONSUME(tokens.Typedef);
    this.CONSUME(tokens.Enum);
    this.OPTION4(() => {
      this.CONSUME(tokens.Less);
      this.SUBRULE(this.typeName);
      this.CONSUME(tokens.Greater);
    });
    this.OPTION3(() => this.CONSUME3(tokens.Identifier));
    this.SUBRULE(this.enumDeclaration);
    this.OPTION2(() => this.CONSUME2(tokens.Identifier));
    this.OPTION(() => this.SUBRULE(this.annotations));
    this.CONSUME(tokens.SemiColon);
  });

  private structDeclaration = this.RULE("structDeclaration", () => {
    this.OPTION(() => this.SUBRULE(this.functionParameterDeclarationList));
    this.SUBRULE(this.block);
  });

  private enumDeclaration = this.RULE("enumDeclaration", () => {
    this.CONSUME(tokens.CurlyBraceOpen);
    this.SUBRULE(this.enumElementDeclaration);
    this.MANY(() => {
      this.CONSUME(tokens.Comma);
      this.SUBRULE2(this.enumElementDeclaration);
    });
    this.OPTION2(() => this.CONSUME2(tokens.Comma));
    this.CONSUME(tokens.CurlyBraceClose);
  });

  private enumElementDeclaration = this.RULE("enumElementDeclaration", () => {
    this.CONSUME(tokens.Identifier);
    this.OPTION(() => {
      this.CONSUME(tokens.Equals);
      this.SUBRULE(this.assignmentExpression);
    });
  });

  private annotations = this.RULE("annotations", () => {
    this.CONSUME(tokens.Less);
    this.MANY_SEP({
      SEP: tokens.Comma,
      DEF: () => this.SUBRULE(this.annotation),
    });
    this.CONSUME(tokens.Greater);
  });

  private annotation = this.RULE("annotation", () => {
    this.CONSUME(tokens.Identifier); // Key
    this.CONSUME(tokens.Equals);
    this.SUBRULE(this.simpleValue);
  });

  private ifStatement = this.RULE("ifStatement", () => {
    this.CONSUME(tokens.If);
    this.SUBRULE(this.parExpression);
    this.SUBRULE(this.statement);
    this.OPTION(() => {
      this.CONSUME(tokens.Else);
      this.SUBRULE2(this.statement);
    });
  });

  private doWhileStatement = this.RULE("doWhileStatement", () => {
    this.CONSUME(tokens.Do);
    this.SUBRULE(this.statement);
    this.CONSUME(tokens.While);
    this.SUBRULE(this.parExpression);
    this.CONSUME(tokens.SemiColon);
  });

  private whileStatement = this.RULE("whileStatement", () => {
    this.CONSUME(tokens.While);
    this.SUBRULE(this.parExpression);
    this.SUBRULE(this.statement);
  });

  private forStatement = this.RULE("forStatement", () => {
    this.CONSUME(tokens.For);
    this.CONSUME(tokens.ParenthesisOpen);
    this.SUBRULE(this.forInitUpdate);
    this.CONSUME2(tokens.SemiColon);
    this.SUBRULE(this.assignmentExpression);
    this.CONSUME3(tokens.SemiColon);
    this.SUBRULE2(this.forInitUpdate);
    this.CONSUME(tokens.ParenthesisClose);
    this.SUBRULE(this.statement);
  });

  private forInitUpdate = this.RULE("forInitUpdate", () => {
    this.MANY_SEP({
      SEP: tokens.Comma,
      DEF: () => this.SUBRULE(this.assignmentExpression),
    });
  });

  private switchStatement = this.RULE("switchStatement", () => {
    this.CONSUME(tokens.Switch);
    this.SUBRULE(this.parExpression);
    this.CONSUME(tokens.CurlyBraceOpen);
    this.MANY(() => this.SUBRULE(this.switchBlockStatementGroup));
    this.CONSUME(tokens.CurlyBraceClose);
  });

  private switchBlockStatementGroup = this.RULE("switchBlockStatementGroup", () => {
    this.SUBRULE(this.switchLabels);
    this.SUBRULE(this.statementList);
  });

  private switchLabels = this.RULE("switchLabels", () => {
    this.MANY(() => {
      this.OR([
        {
          ALT: () => {
            this.CONSUME(tokens.Case);
            this.SUBRULE(this.simpleValue);
          },
        },
        { ALT: () => this.CONSUME(tokens.Default) },
      ]);
      this.CONSUME(tokens.Colon);
    });
  });

  private breakStatement = this.RULE("breakStatement", () => {
    this.CONSUME(tokens.Break);
    this.CONSUME(tokens.SemiColon);
  });

  private emptyStatement = this.RULE("emptyStatement", () => {
    this.CONSUME(tokens.SemiColon);
  });

  private returnStatement = this.RULE("returnStatement", () => {
    this.CONSUME(tokens.Return);
    this.OPTION(() => this.SUBRULE(this.assignmentExpression));
    this.CONSUME(tokens.SemiColon);
  });

  private parExpression = this.RULE("parExpression", () => {
    this.CONSUME(tokens.ParenthesisOpen);
    this.SUBRULE(this.assignmentExpression);
    this.CONSUME(tokens.ParenthesisClose);
  });

  private expressionOrTypeName = this.RULE("expressionOrTypeName", () => {
    this.OR({
      DEF: [
        { ALT: () => this.SUBRULE(this.assignmentExpression) },
        {
          GATE: () => this.LA(1).tokenType !== tokens.Identifier,
          ALT: () => this.SUBRULE(this.typeNameWithoutVoid),
        },
      ],
      IGNORE_AMBIGUITIES: true,
    });
  });

  private expressionStatement = this.RULE("expressionStatement", () => {
    this.SUBRULE(this.assignmentExpression);
    this.CONSUME(tokens.SemiColon);
  });

  /**
   * Level 1 precedence: ternary
   */
  private ternaryExpression = this.RULE("ternaryExpression", () => {
    this.SUBRULE(this.booleanOrExpression);
    this.OPTION(() => {
      this.CONSUME(tokens.Question);
      this.SUBRULE(this.assignmentExpression);
      this.CONSUME(tokens.Colon);
      this.SUBRULE2(this.ternaryExpression);
    });
  });

  /**
   * Level 2 precedence: boolean or (||)
   */
  private booleanOrExpression = this.RULE("booleanOrExpression", () => {
    this.SUBRULE(this.booleanAndExpression);
    this.MANY(() => {
      this.CONSUME(tokens.BooleanOr);
      this.SUBRULE2(this.booleanAndExpression);
    });
  });

  /**
   * Level 3 precedence: boolean and (&&)
   */
  private booleanAndExpression = this.RULE("booleanAndExpression", () => {
    this.SUBRULE(this.binaryOrExpression);
    this.MANY(() => {
      this.CONSUME(tokens.BooleanAnd);
      this.SUBRULE2(this.binaryOrExpression);
    });
  });

  /**
   * Level 4 precedence: binary or (|)
   */
  private binaryOrExpression = this.RULE("binaryOrExpression", () => {
    this.SUBRULE(this.binaryXorExpression);
    this.MANY(() => {
      this.CONSUME(tokens.BinaryOr);
      this.SUBRULE2(this.binaryXorExpression);
    });
  });

  /**
   * Level 5 precedence: binary xor (^)
   */
  private binaryXorExpression = this.RULE("binaryXorExpression", () => {
    this.SUBRULE(this.binaryAndExpression);
    this.MANY(() => {
      this.CONSUME(tokens.BinaryXor);
      this.SUBRULE2(this.binaryAndExpression);
    });
  });

  /**
   * Level 6 precedence: binary and (&)
   */
  private binaryAndExpression = this.RULE("binaryAndExpression", () => {
    this.SUBRULE(this.equalityExpression);
    this.MANY(() => {
      this.CONSUME(tokens.BinaryAnd);
      this.SUBRULE2(this.equalityExpression);
    });
  });

  /**
   * Level 7 precedence: equality (== !=)
   */
  private equalityExpression = this.RULE("equalityExpression", () => {
    this.SUBRULE(this.relationalExpression);
    this.MANY(() => {
      this.SUBRULE(this.equalityOperator);
      this.SUBRULE2(this.relationalExpression);
    });
  });

  /**
   * Level 8 precedence: relational (< <= > >=)
   */
  private relationalExpression = this.RULE("relationalExpression", () => {
    this.SUBRULE(this.shiftExpression);
    this.OPTION(() => {
      this.SUBRULE(this.relationalOperator);
      this.SUBRULE2(this.shiftExpression);
    });
  });

  /**
   * Level 9 precedence: shift (<< >> >>>)
   */
  private shiftExpression = this.RULE("shiftExpression", () => {
    this.SUBRULE(this.additiveExpression);
    this.MANY(() => {
      this.SUBRULE(this.shiftOperator);
      this.SUBRULE2(this.additiveExpression);
    });
  });

  /**
   * Level 10 precedence: additive (+ -)
   */
  private additiveExpression = this.RULE("additiveExpression", () => {
    this.SUBRULE(this.multiplicativeExpression);
    this.MANY(() => {
      this.SUBRULE(this.additiveOperator);
      this.SUBRULE2(this.multiplicativeExpression);
    });
  });

  /**
   * Level 11 precedence: multiplicative (* / %)
   */
  private multiplicativeExpression = this.RULE("multiplicativeExpression", () => {
    this.SUBRULE(this.castExpression);
    this.MANY(() => {
      this.SUBRULE(this.multiplicativeOperator);
      this.SUBRULE2(this.castExpression);
    });
  });

  /**
   * Level 12 precedence: cast (type)
   */
  private castExpression = this.RULE("castExpression", () => {
    this.OR({
      DEF: [
        {
          GATE: this.BACKTRACK(this.castOperation),
          ALT: () => this.SUBRULE(this.castOperation),
        },
        {
          GATE: this.BACKTRACK(this.prefixExpression),
          ALT: () => this.SUBRULE(this.prefixExpression),
        },
      ],
      IGNORE_AMBIGUITIES: true,
    });
  });

  private castOperation = this.RULE("castOperation", () => {
    this.CONSUME(tokens.ParenthesisOpen);
    this.SUBRULE(this.typeNameWithoutVoid);
    this.CONSUME(tokens.ParenthesisClose);
    this.SUBRULE(this.prefixExpression);
  });

  /**
   * Level 13 precedence: prefix (++ -- + - ! ~)
   */
  private prefixExpression = this.RULE("prefixExpression", () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.postfixExpression) },
      {
        ALT: () => {
          this.SUBRULE(this.prefixOperator);
          this.SUBRULE(this.prefixExpression);
        },
      },
      {
        ALT: () => {
          this.SUBRULE(this.unaryOperator);
          this.SUBRULE(this.castExpression);
        },
      },
    ]);
  });

  /**
   * Level 14 precedence: postfix (++ --)
   */
  private postfixExpression = this.RULE("postfixExpression", () => {
    this.SUBRULE(this.callExpression);
    this.MANY(() => this.SUBRULE(this.postfixOperator));
  });

  /**
   * Level 15 precedence: access (array object parentheses)
   */
  private callExpression = this.RULE("callExpression", () => {
    this.SUBRULE(this.memberExpression);
    this.MANY(() => this.SUBRULE(this.callExpressionRest));
  });

  private callExpressionRest = this.RULE("callExpressionRest", () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.arguments) },
      { ALT: () => this.SUBRULE(this.arraySelector) },
      { ALT: () => this.SUBRULE(this.propertyAccess) },
    ]);
  });

  private memberExpression = this.RULE("memberExpression", () => {
    this.SUBRULE(this.primaryExpression);
    this.MANY(() => this.SUBRULE(this.memberExpressionRest));
  });

  private memberExpressionRest = this.RULE("memberExpressionRest", () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.arraySelector) },
      { ALT: () => this.SUBRULE(this.propertyAccess) },
    ]);
  });

  private propertyAccess = this.RULE("propertyAccess", () => {
    this.CONSUME(tokens.Period);
    this.CONSUME(tokens.Identifier);
  });

  private primaryExpression = this.RULE("primaryExpression", () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.simpleValue) },
      {
        ALT: () => {
          this.CONSUME(tokens.Sizeof);
          this.CONSUME(tokens.ParenthesisOpen);
          this.SUBRULE(this.expressionOrTypeName);
          this.CONSUME(tokens.ParenthesisClose);
        },
      },
      {
        ALT: () => {
          this.CONSUME(tokens.Startof);
          this.CONSUME3(tokens.ParenthesisOpen);
          this.SUBRULE3(this.expressionOrTypeName);
          this.CONSUME3(tokens.ParenthesisClose);
        },
      },
      {
        ALT: () => {
          this.CONSUME(tokens.Exists);
          this.CONSUME2(tokens.ParenthesisOpen);
          this.SUBRULE2(this.expressionOrTypeName);
          this.CONSUME2(tokens.ParenthesisClose);
        },
      },
      { ALT: () => this.SUBRULE(this.parExpression) },
    ]);
  });

  private variableModifier = this.RULE("variableModifier", () => {
    this.OR([{ ALT: () => this.CONSUME(tokens.Local) }, { ALT: () => this.CONSUME(tokens.Const) }]);
  });

  private variableDeclarators = this.RULE("variableDeclarators", () => {
    this.AT_LEAST_ONE_SEP({
      SEP: tokens.Comma,
      DEF: () => this.SUBRULE(this.variableDeclarator),
    });
  });

  private variableDeclarator = this.RULE("variableDeclarator", () => {
    this.CONSUME(tokens.Identifier);
    this.SUBRULE(this.variableDeclaratorRest);
    this.OPTION(() => this.SUBRULE(this.bitfieldRest));
    this.OPTION2(() => this.SUBRULE(this.annotations));
  });

  private variableDeclaratorRest = this.RULE("variableDeclaratorRest", () => {
    // Be careful to avoid duplication with the function declaration rule
    this.OPTION(() => this.SUBRULE(this.arguments));
    this.OPTION1(() => this.SUBRULE(this.anyArraySelector));
    this.OPTION3(() => this.SUBRULE(this.annotations));
    this.OPTION2(() => {
      this.CONSUME(tokens.Equals);
      this.SUBRULE(this.variableInitializer);
    });
  });

  private variableInitializer = this.RULE("variableInitializer", () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.assignmentExpression) },
      { ALT: () => this.SUBRULE(this.arrayInitializer) },
    ]);
  });

  private arrayInitializer = this.RULE("arrayInitializer", () => {
    this.CONSUME(tokens.CurlyBraceOpen);
    // No trailing comma supported
    this.AT_LEAST_ONE_SEP({ SEP: tokens.Comma, DEF: () => this.SUBRULE2(this.assignmentExpression) });
    this.CONSUME(tokens.CurlyBraceClose);
  });

  private arraySelector = this.RULE("arraySelector", () => {
    this.CONSUME(tokens.BracketOpen);
    this.SUBRULE(this.assignmentExpression);
    this.CONSUME(tokens.BracketClose);
  });

  private anyArraySelector = this.RULE("anyArraySelector", () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.arraySelector) },
      { ALT: () => this.SUBRULE(this.emptyArraySelector) },
    ]);
  });

  private emptyArraySelector = this.RULE("emptyArraySelector", () => {
    this.CONSUME(tokens.BracketOpen);
    this.CONSUME(tokens.BracketClose);
  });

  private arguments = this.RULE("arguments", () => {
    this.CONSUME(tokens.ParenthesisOpen);
    this.MANY_SEP({
      SEP: tokens.Comma,
      DEF: () => this.SUBRULE(this.assignmentExpression),
    });
    this.CONSUME(tokens.ParenthesisClose);
  });

  private assignmentOperator = this.RULE("assignmentOperator", () => {
    this.OR([
      { ALT: () => this.CONSUME(tokens.BinaryAndEquals) },
      { ALT: () => this.CONSUME(tokens.BinaryOrEquals) },
      { ALT: () => this.CONSUME(tokens.BinaryXorEquals) },
      { ALT: () => this.CONSUME(tokens.DivisionEquals) },
      { ALT: () => this.CONSUME(tokens.Equals) },
      { ALT: () => this.CONSUME(tokens.MinusEquals) },
      { ALT: () => this.CONSUME(tokens.ModuloEquals) },
      { ALT: () => this.CONSUME(tokens.MultiplicationEquals) },
      { ALT: () => this.CONSUME(tokens.PlusEquals) },
      { ALT: () => this.CONSUME(tokens.ShiftLeftEquals) },
      { ALT: () => this.CONSUME(tokens.ShiftRightEquals) },
      { ALT: () => this.CONSUME(tokens.UnsignedShiftRightEquals) },
    ]);
  });

  private equalityOperator = this.RULE("equalityOperator", () =>
    this.OR([
      { ALT: () => this.CONSUME(tokens.DoubleEquals) },
      { ALT: () => this.CONSUME(tokens.Different) },
    ]),
  );

  private relationalOperator = this.RULE("relationalOperator", () => {
    this.OR([
      { ALT: () => this.CONSUME(tokens.Greater) },
      { ALT: () => this.CONSUME(tokens.Less) },
      { ALT: () => this.CONSUME(tokens.GreaterOrEqual) },
      { ALT: () => this.CONSUME(tokens.LessOrEqual) },
    ]);
  });

  private shiftOperator = this.RULE("shiftOperator", () => {
    this.OR([
      { ALT: () => this.CONSUME(tokens.ShiftLeft) },
      { ALT: () => this.CONSUME(tokens.ShiftRight) },
      { ALT: () => this.CONSUME(tokens.UnsignedShiftRight) },
    ]);
  });

  private additiveOperator = this.RULE("additiveOperator", () =>
    this.OR([{ ALT: () => this.CONSUME(tokens.Plus) }, { ALT: () => this.CONSUME(tokens.Minus) }]),
  );

  private multiplicativeOperator = this.RULE("multiplicativeOperator", () => {
    this.OR([
      { ALT: () => this.CONSUME(tokens.Multiplication) },
      { ALT: () => this.CONSUME(tokens.Division) },
      { ALT: () => this.CONSUME(tokens.Modulo) },
    ]);
  });

  private prefixOperator = this.RULE("prefixOperator", () =>
    this.OR2([
      { ALT: () => this.CONSUME(tokens.DoublePlus) },
      { ALT: () => this.CONSUME(tokens.DoubleMinus) },
    ]),
  );

  private postfixOperator = this.RULE("postfixOperator", () =>
    this.OR2([
      { ALT: () => this.CONSUME(tokens.DoublePlus) },
      { ALT: () => this.CONSUME(tokens.DoubleMinus) },
    ]),
  );

  private unaryOperator = this.RULE("unaryOperator", () => {
    this.OR3([
      { ALT: () => this.CONSUME(tokens.Tilda) },
      { ALT: () => this.CONSUME(tokens.Exclamation) },
      { ALT: () => this.CONSUME(tokens.Plus) },
      { ALT: () => this.CONSUME(tokens.Minus) },
    ]);
  });

  /**
   * Function parameters declaration
   */
  private functionParameterDeclarationList = this.RULE("functionParameterDeclarationList", () => {
    this.CONSUME(tokens.ParenthesisOpen);
    this.OR([
      { ALT: () => this.CONSUME(tokens.Void) },
      {
        ALT: () =>
          this.MANY_SEP({
            SEP: tokens.Comma,
            DEF: () => this.SUBRULE(this.functionParameterDeclaration),
          }),
      },
    ]);
    this.CONSUME(tokens.ParenthesisClose);
  });

  /**
   * Single function parameter declaration
   */
  private functionParameterDeclaration = this.RULE("functionParameterDeclaration", () => {
    this.MANY(() => this.SUBRULE(this.variableModifier));
    this.SUBRULE(this.typeNameWithoutVoid); // Parameter type
    this.OPTION(() => this.CONSUME(tokens.BinaryAnd));
    this.CONSUME1(tokens.Identifier); // Parameter name
    this.OPTION2(() => this.SUBRULE(this.anyArraySelector));
  });

  /**
   * Represents any number, in any representation (binary, octal, decimal, hexadecimal)
   */
  private number = this.RULE("number", () => {
    this.OR([
      { ALT: () => this.CONSUME(tokens.NumberBinaryLiteral) },
      { ALT: () => this.CONSUME(tokens.NumberOctalLiteral) },
      { ALT: () => this.CONSUME(tokens.NumberDecimalLiteral) },
      { ALT: () => this.CONSUME(tokens.NumberHexadecimalLiteral) },
      { ALT: () => this.CONSUME(tokens.NumberHexadecimalLiteral2) },
    ]);
  });

  /**
   * Represents any type (void being included)
   */
  private typeName = this.RULE("typeName", () => {
    this.OR([
      { ALT: () => this.CONSUME(tokens.Void) },
      { ALT: () => this.SUBRULE(this.typeNameWithoutVoid) },
    ]);
  });

  /**
   * Represents any concrete type (void being excluded)
   */
  private typeNameWithoutVoid = this.RULE("typeNameWithoutVoid", () => {
    this.OPTION(() =>
      this.OR2([
        { ALT: () => this.CONSUME(tokens.Signed) },
        { ALT: () => this.CONSUME(tokens.Unsigned) },
        { ALT: () => this.CONSUME(tokens.Struct) },
        { ALT: () => this.CONSUME(tokens.Enum) },
      ]),
    );
    this.CONSUME2(tokens.Identifier);
    this.OPTION2(() => this.SUBRULE(this.emptyArraySelector));
  });

  private simpleValue = this.RULE("simpleValue", () => {
    this.OR([
      { ALT: () => this.CONSUME(tokens.Identifier) },
      { ALT: () => this.SUBRULE(this.number) },
      { ALT: () => this.CONSUME(tokens.StringLiteral) },
      { ALT: () => this.SUBRULE(this.boolean) },
    ]);
  });

  private boolean = this.RULE("boolean", () => {
    this.OR([{ ALT: () => this.CONSUME(tokens.True) }, { ALT: () => this.CONSUME(tokens.False) }]);
  });
  public constructor() {
    super(values(tokens), {
      recoveryEnabled: false,
      maxLookahead: 5,
      outputCst: true,
    });

    this.performSelfAnalysis();
  }
}
