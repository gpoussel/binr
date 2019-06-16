"use strict";

const _ = require("lodash");
const chevrotain = require("chevrotain");
const { tokens } = require("./sweetscape-tokens");

const { Parser } = chevrotain;

class SweetscapeParser extends Parser {
  constructor() {
    super(_.values(tokens), {
      recoveryEnabled: false,
      maxLookahead: 5,
      outputCst: true,
      ignoredIssues: {
        topLevelStatement: { OR: true },
        expressionOrTypeName: { OR: true },
        castExpression: { OR: true },
      },
    });

    const $ = this;

    $.RULE("definition", () => {
      $.MANY(() => $.SUBRULE($.topLevelStatement));
    });

    $.RULE("topLevelStatement", () => {
      $.OR([
        {
          GATE: () => $.BACKTRACK($.functionDeclarationStatement),
          ALT: () => $.SUBRULE($.functionDeclarationStatement),
        },
        {
          ALT: () => $.SUBRULE($.emptyStructStatement),
        },
        {
          GATE: () => $.BACKTRACK($.statement),
          ALT: () => $.SUBRULE($.statement),
        },
      ]);
    });

    $.RULE("statementList", () => {
      $.MANY(() => $.SUBRULE($.statement));
    });

    $.RULE("block", () => {
      $.CONSUME(tokens.CurlyBraceOpen);
      $.SUBRULE($.statementList);
      $.CONSUME(tokens.CurlyBraceClose);
    });

    $.RULE("statement", () => {
      $.OR([
        { ALT: () => $.SUBRULE($.block) },
        { ALT: () => $.SUBRULE($.expressionStatement) },
        { ALT: () => $.SUBRULE($.localVariableDeclarationStatement) },
        { ALT: () => $.SUBRULE($.typedefStatement) },
        { ALT: () => $.SUBRULE($.structStatement) },
        { ALT: () => $.SUBRULE($.enumStatement) },
        { ALT: () => $.SUBRULE($.ifStatement) },
        { ALT: () => $.SUBRULE($.whileStatement) },
        { ALT: () => $.SUBRULE($.doWhileStatement) },
        { ALT: () => $.SUBRULE($.forStatement) },
        { ALT: () => $.SUBRULE($.switchStatement) },
        { ALT: () => $.SUBRULE($.returnStatement) },
        { ALT: () => $.SUBRULE($.breakStatement) },
        { ALT: () => $.CONSUME(tokens.SemiColon) },
      ]);
    });

    $.RULE("functionDeclarationStatement", () => {
      $.SUBRULE($.typeName);
      $.CONSUME1(tokens.Identifier); // Function name
      $.SUBRULE($.functionParameterDeclarationList);
      $.OR([
        {
          ALT: () => {
            $.CONSUME(tokens.CurlyBraceOpen);
            $.SUBRULE($.statementList);
            $.CONSUME(tokens.CurlyBraceClose);
          },
        },
        {
          ALT: () => {
            // Forward declaration
            $.CONSUME(tokens.SemiColon);
          },
        },
      ]);
    });

    $.RULE("localVariableDeclarationStatement", () => {
      $.MANY(() => $.SUBRULE($.variableModifier));
      $.SUBRULE($.typeName);
      $.OR([
        { ALT: () => $.SUBRULE($.variableDeclarators) },
        {
          ALT: () => {
            $.SUBRULE2($.bitfieldRest);
            $.OPTION(() => $.SUBRULE($.annotations));
          },
        },
      ]);
      $.CONSUME(tokens.SemiColon);
    });

    $.RULE("bitfieldRest", () => {
      $.CONSUME(tokens.Colon);
      $.SUBRULE($.additiveExpression);
    });

    $.RULE("typedefStatement", () => {
      $.CONSUME(tokens.Typedef);
      $.SUBRULE($.typeName); // Type
      $.CONSUME2(tokens.Identifier); // Alias
      $.OPTION4(() => $.SUBRULE($.selector));
      $.OPTION2(() => $.SUBRULE($.annotations));
      $.CONSUME(tokens.SemiColon);
    });

    $.RULE("emptyStructStatement", () => {
      $.CONSUME(tokens.Struct);
      $.CONSUME3(tokens.Identifier);
      $.CONSUME(tokens.SemiColon);
    });

    $.RULE("structStatement", () => {
      $.OPTION(() => $.CONSUME(tokens.Typedef));
      $.OR2([{ ALT: () => $.CONSUME(tokens.Struct) }, { ALT: () => $.CONSUME(tokens.Union) }]);
      $.OPTION2(() => $.CONSUME(tokens.Identifier)); // Alias
      $.SUBRULE2($.structDeclaration);
      $.OPTION4(() => $.SUBRULE($.variableDeclarator));
      $.CONSUME(tokens.SemiColon);
    });

    $.RULE("enumStatement", () => {
      $.OPTION(() => $.CONSUME(tokens.Typedef));
      $.CONSUME(tokens.Enum);
      $.OPTION2(() => {
        $.CONSUME(tokens.Less);
        $.SUBRULE($.typeName);
        $.CONSUME(tokens.Greater);
      });
      $.OR([
        {
          ALT: () => {
            $.CONSUME1(tokens.Identifier); // Type name
            $.OPTION6(() => $.SUBRULE($.enumDeclaration));
            $.OPTION4(() => $.SUBRULE($.variableDeclarator));
          },
        },
        {
          ALT: () => {
            $.SUBRULE2($.enumDeclaration);
            $.OPTION5(() => $.SUBRULE2($.variableDeclarators));
          },
        },
      ]);
      $.CONSUME(tokens.SemiColon);
    });

    $.RULE("structDeclaration", () => {
      $.OPTION(() => $.SUBRULE($.functionParameterDeclarationList));
      $.CONSUME(tokens.CurlyBraceOpen);
      $.SUBRULE($.statementList);
      $.CONSUME(tokens.CurlyBraceClose);
    });

    $.RULE("enumDeclaration", () => {
      $.CONSUME(tokens.CurlyBraceOpen);
      $.SUBRULE($.enumElementDeclaration);
      $.MANY(() => {
        $.CONSUME(tokens.Comma);
        $.SUBRULE2($.enumElementDeclaration);
      });
      $.OPTION2(() => $.CONSUME2(tokens.Comma));
      $.CONSUME(tokens.CurlyBraceClose);
    });

    $.RULE("enumElementDeclaration", () => {
      $.CONSUME(tokens.Identifier);
      $.OPTION(() => {
        $.CONSUME(tokens.Equals);
        $.SUBRULE($.assignmentExpression);
      });
    });

    $.RULE("annotations", () => {
      $.CONSUME(tokens.Less);
      $.MANY_SEP({
        SEP: tokens.Comma,
        DEF: () => $.SUBRULE($.annotation),
      });
      $.CONSUME(tokens.Greater);
    });

    $.RULE("annotation", () => {
      $.CONSUME(tokens.Identifier); // Key
      $.CONSUME(tokens.Equals);
      $.OR([
        { ALT: () => $.CONSUME2(tokens.Identifier) },
        { ALT: () => $.CONSUME(tokens.StringLiteral) },
        { ALT: () => $.SUBRULE($.number) },
      ]);
    });

    $.RULE("ifStatement", () => {
      $.CONSUME(tokens.If);
      $.SUBRULE($.parExpression);
      $.SUBRULE($.statement);
      $.OPTION(() => {
        $.CONSUME(tokens.Else);
        $.SUBRULE2($.statement);
      });
    });

    $.RULE("doWhileStatement", () => {
      $.CONSUME(tokens.Do);
      $.SUBRULE($.statement);
      $.CONSUME(tokens.While);
      $.SUBRULE($.parExpression);
      $.CONSUME(tokens.SemiColon);
    });

    $.RULE("whileStatement", () => {
      $.CONSUME(tokens.While);
      $.SUBRULE($.parExpression);
      $.SUBRULE($.statement);
    });

    $.RULE("forStatement", () => {
      $.CONSUME(tokens.For);
      $.CONSUME(tokens.ParenthesisOpen);
      $.SUBRULE($.forInitUpdate);
      $.CONSUME2(tokens.SemiColon);
      $.SUBRULE($.assignmentExpression);
      $.CONSUME3(tokens.SemiColon);
      $.SUBRULE2($.forInitUpdate);
      $.CONSUME(tokens.ParenthesisClose);
      $.SUBRULE($.statement);
    });

    $.RULE("forInitUpdate", () => {
      $.MANY_SEP({
        SEP: tokens.Comma,
        DEF: () => $.SUBRULE($.assignmentExpression),
      });
    });

    $.RULE("switchStatement", () => {
      $.CONSUME(tokens.Switch);
      $.SUBRULE($.parExpression);
      $.CONSUME(tokens.CurlyBraceOpen);
      $.MANY(() => $.SUBRULE($.switchBlockStatementGroup));
      $.CONSUME(tokens.CurlyBraceClose);
    });

    $.RULE("switchBlockStatementGroup", () => {
      $.SUBRULE($.switchLabels);
      $.SUBRULE($.statementList);
    });

    $.RULE("switchLabels", () => {
      $.MANY(() => {
        $.OR([
          {
            ALT: () => {
              $.CONSUME(tokens.Case);
              $.OR2([
                { ALT: () => $.SUBRULE($.number) },
                { ALT: () => $.CONSUME(tokens.Identifier) },
                { ALT: () => $.CONSUME(tokens.StringLiteral) },
              ]);
            },
          },
          {
            ALT: () => {
              $.CONSUME(tokens.Default);
            },
          },
        ]);
        $.CONSUME(tokens.Colon);
      });
    });

    $.RULE("breakStatement", () => {
      $.CONSUME(tokens.Break);
      $.CONSUME(tokens.SemiColon);
    });

    $.RULE("returnStatement", () => {
      $.CONSUME(tokens.Return);
      $.OPTION(() => $.SUBRULE($.assignmentExpression));
      $.CONSUME(tokens.SemiColon);
    });

    $.RULE("parExpression", () => {
      $.CONSUME(tokens.ParenthesisOpen);
      $.SUBRULE($.assignmentExpression);
      $.CONSUME(tokens.ParenthesisClose);
    });

    $.RULE("expressionOrTypeName", () => {
      $.OR([
        { ALT: () => $.SUBRULE($.assignmentExpression) },
        {
          GATE: () => $.LA(1).tokenType !== tokens.Identifier,
          ALT: () => $.SUBRULE($.typeNameWithoutVoid),
        },
      ]);
    });

    $.RULE("expressionStatement", () => {
      $.SUBRULE($.assignmentExpression);
      $.CONSUME(tokens.SemiColon);
    });

    /**
     * Level 0 precedence: assignment expressions
     */
    $.RULE("assignmentExpression", () => {
      $.SUBRULE($.ternaryExpression);
      $.MANY(() => {
        $.SUBRULE($.assignmentOperator);
        $.SUBRULE1($.ternaryExpression);
      });
    });

    /**
     * Level 1 precedence: ternary
     */
    $.RULE("ternaryExpression", () => {
      $.SUBRULE($.booleanOrExpression);
      $.OPTION(() => {
        $.CONSUME(tokens.Question);
        $.SUBRULE($.assignmentExpression);
        $.CONSUME(tokens.Colon);
        $.SUBRULE2($.ternaryExpression);
      });
    });

    /**
     * Level 2 precedence: boolean or (||)
     */
    $.RULE("booleanOrExpression", () => {
      $.SUBRULE($.booleanAndExpression);
      $.MANY(() => {
        $.CONSUME(tokens.BooleanOr);
        $.SUBRULE2($.booleanAndExpression);
      });
    });

    /**
     * Level 3 precedence: boolean and (&&)
     */
    $.RULE("booleanAndExpression", () => {
      $.SUBRULE($.binaryOrExpression);
      $.MANY(() => {
        $.CONSUME(tokens.BooleanAnd);
        $.SUBRULE2($.binaryOrExpression);
      });
    });

    /**
     * Level 4 precedence: binary or (|)
     */
    $.RULE("binaryOrExpression", () => {
      $.SUBRULE($.binaryXorExpression);
      $.MANY(() => {
        $.CONSUME(tokens.BinaryOr);
        $.SUBRULE2($.binaryXorExpression);
      });
    });

    /**
     * Level 5 precedence: binary xor (^)
     */
    $.RULE("binaryXorExpression", () => {
      $.SUBRULE($.binaryAndExpression);
      $.MANY(() => {
        $.CONSUME(tokens.BinaryXor);
        $.SUBRULE2($.binaryAndExpression);
      });
    });

    /**
     * Level 6 precedence: binary and (&)
     */
    $.RULE("binaryAndExpression", () => {
      $.SUBRULE($.equalityExpression);
      $.MANY(() => {
        $.CONSUME(tokens.BinaryAnd);
        $.SUBRULE2($.equalityExpression);
      });
    });

    /**
     * Level 7 precedence: equality (== !=)
     */
    $.RULE("equalityExpression", () => {
      $.SUBRULE($.relationalExpression);
      $.MANY(() => {
        $.SUBRULE($.equalityOperator);
        $.SUBRULE2($.relationalExpression);
      });
    });

    /**
     * Level 8 precedence: relational (< <= > >=)
     */
    $.RULE("relationalExpression", () => {
      $.SUBRULE($.shiftExpression);
      $.OPTION(() => {
        $.SUBRULE($.relationalOperator);
        $.SUBRULE2($.shiftExpression);
      });
    });

    /**
     * Level 9 precedence: shift (<< >> >>>)
     */
    $.RULE("shiftExpression", () => {
      $.SUBRULE($.additiveExpression);
      $.MANY(() => {
        $.SUBRULE($.shiftOperator);
        $.SUBRULE2($.additiveExpression);
      });
    });

    /**
     * Level 10 precedence: additive (+ -)
     */
    $.RULE("additiveExpression", () => {
      $.SUBRULE($.multiplicativeExpression);
      $.MANY(() => {
        $.SUBRULE($.additiveOperator);
        $.SUBRULE2($.multiplicativeExpression);
      });
    });

    /**
     * Level 11 precedence: multiplicative (* / %)
     */
    $.RULE("multiplicativeExpression", () => {
      $.SUBRULE($.castExpression);
      $.MANY(() => {
        $.SUBRULE($.multiplicativeOperator);
        $.SUBRULE2($.castExpression);
      });
    });

    /**
     * Level 12 precedence: cast (type)
     */
    $.RULE("castExpression", () => {
      $.OR([
        {
          GATE: () => $.BACKTRACK($.castOperation),
          ALT: () => $.SUBRULE($.castOperation),
        },
        {
          GATE: () => $.BACKTRACK($.prefixExpression),
          ALT: () => $.SUBRULE($.prefixExpression),
        },
      ]);
    });

    $.RULE("castOperation", () => {
      $.CONSUME(tokens.ParenthesisOpen);
      $.SUBRULE($.typeNameWithoutVoid);
      $.CONSUME(tokens.ParenthesisClose);
      $.SUBRULE($.prefixExpression);
    });

    /**
     * Level 13 precedence: prefix (++ -- + - ! ~)
     */
    $.RULE("prefixExpression", () => {
      $.OR([
        { ALT: () => $.SUBRULE($.postfixExpression) },
        {
          ALT: () => {
            $.SUBRULE($.prefixOperator);
            $.SUBRULE($.prefixExpression);
          },
        },
        {
          ALT: () => {
            $.SUBRULE($.unaryOperator);
            $.SUBRULE($.castExpression);
          },
        },
      ]);
    });

    /**
     * Level 14 precedence: postfix (++ --)
     */
    $.RULE("postfixExpression", () => {
      $.SUBRULE($.callExpression);
      $.MANY(() => $.SUBRULE($.postfixOperator));
    });

    /**
     * Level 15 precedence: access (array object parentheses)
     */
    $.RULE("callExpression", () => {
      $.SUBRULE($.memberExpression);
      $.MANY(() => $.SUBRULE($.callExpressionRest));
    });

    $.RULE("callExpressionRest", () => {
      $.OR([
        { ALT: () => $.SUBRULE($.arguments) },
        {
          ALT: () => {
            $.CONSUME(tokens.BracketOpen);
            $.SUBRULE($.assignmentExpression);
            $.CONSUME(tokens.BracketClose);
          },
        },
        {
          ALT: () => {
            $.CONSUME(tokens.Period);
            $.CONSUME(tokens.Identifier);
          },
        },
      ]);
    });

    $.RULE("memberExpression", () => {
      $.SUBRULE($.primaryExpression);
      $.MANY(() => $.SUBRULE($.memberExpressionRest));
    });

    $.RULE("memberExpressionRest", () => {
      $.OR([
        {
          ALT: () => {
            $.CONSUME(tokens.BracketOpen);
            $.SUBRULE($.assignmentExpression);
            $.CONSUME(tokens.BracketClose);
          },
        },
        {
          ALT: () => {
            $.CONSUME(tokens.Period);
            $.CONSUME(tokens.Identifier);
          },
        },
      ]);
    });

    $.RULE("primaryExpression", () => {
      $.OR([
        { ALT: () => $.CONSUME(tokens.Identifier) },
        { ALT: () => $.SUBRULE($.number) },
        { ALT: () => $.CONSUME(tokens.StringLiteral) },
        {
          ALT: () => {
            $.CONSUME(tokens.Sizeof);
            $.CONSUME(tokens.ParenthesisOpen);
            $.SUBRULE($.expressionOrTypeName);
            $.CONSUME(tokens.ParenthesisClose);
          },
        },
        {
          ALT: () => {
            $.CONSUME2(tokens.ParenthesisOpen);
            $.SUBRULE2($.assignmentExpression);
            $.CONSUME2(tokens.ParenthesisClose);
          },
        },
      ]);
    });

    $.RULE("variableModifier", () => {
      $.OR([{ ALT: () => $.CONSUME(tokens.Local) }, { ALT: () => $.CONSUME(tokens.Const) }]);
    });

    $.RULE("variableDeclarators", () => {
      $.AT_LEAST_ONE_SEP({
        SEP: tokens.Comma,
        DEF: () => $.SUBRULE($.variableDeclarator),
      });
    });

    $.RULE("variableDeclarator", () => {
      $.CONSUME(tokens.Identifier);
      $.SUBRULE($.variableDeclaratorRest);
      $.OPTION(() => $.SUBRULE($.bitfieldRest));
      $.OPTION2(() => $.SUBRULE($.annotations));
    });

    $.RULE("variableDeclaratorRest", () => {
      // Be careful to avoid duplication with the function declaration rule
      $.OPTION(() => $.SUBRULE($.arguments));
      $.OPTION1(() => {
        $.CONSUME(tokens.BracketOpen);
        $.OPTION4(() => $.SUBRULE($.assignmentExpression));
        $.CONSUME(tokens.BracketClose);
      });
      $.OPTION3(() => $.SUBRULE($.annotations));
      $.OPTION2(() => {
        $.CONSUME(tokens.Equals);
        $.SUBRULE($.variableInitializer);
      });
    });

    $.RULE("variableInitializer", () => {
      $.OR([{ ALT: () => $.SUBRULE($.assignmentExpression) }, { ALT: () => $.SUBRULE($.arrayInitializer) }]);
    });

    $.RULE("arrayInitializer", () => {
      $.CONSUME(tokens.CurlyBraceOpen);
      // No trailing comma supported
      $.AT_LEAST_ONE_SEP({ SEP: tokens.Comma, DEF: () => $.SUBRULE2($.assignmentExpression) });
      $.CONSUME(tokens.CurlyBraceClose);
    });

    $.RULE("selector", () => {
      $.OR([
        {
          ALT: () => {
            $.CONSUME(tokens.Period);
            $.CONSUME(tokens.Identifier);
          },
        },
        { ALT: () => $.SUBRULE($.arraySelector) },
      ]);
    });

    $.RULE("arraySelector", () => {
      $.CONSUME(tokens.BracketOpen);
      $.SUBRULE($.assignmentExpression);
      $.CONSUME(tokens.BracketClose);
    });

    $.RULE("arguments", () => {
      $.CONSUME(tokens.ParenthesisOpen);
      $.MANY_SEP({
        SEP: tokens.Comma,
        DEF: () => $.SUBRULE($.assignmentExpression),
      });
      $.CONSUME(tokens.ParenthesisClose);
    });

    $.RULE("assignmentOperator", () => {
      $.OR([
        { ALT: () => $.CONSUME(tokens.Equals) },
        { ALT: () => $.CONSUME(tokens.MultiplicationEquals) },
        { ALT: () => $.CONSUME(tokens.DivisionEquals) },
        { ALT: () => $.CONSUME(tokens.ModuloEquals) },
        { ALT: () => $.CONSUME(tokens.PlusEquals) },
        { ALT: () => $.CONSUME(tokens.MinusEquals) },
        { ALT: () => $.CONSUME(tokens.ShiftLeftEquals) },
        { ALT: () => $.CONSUME(tokens.ShiftRightEquals) },
        { ALT: () => $.CONSUME(tokens.UnsignedShiftRightEquals) },
        { ALT: () => $.CONSUME(tokens.BinaryAndEquals) },
        { ALT: () => $.CONSUME(tokens.BinaryXorEquals) },
        { ALT: () => $.CONSUME(tokens.BinaryOrEquals) },
      ]);
    });

    $.RULE("equalityOperator", () =>
      $.OR([{ ALT: () => $.CONSUME(tokens.DoubleEquals) }, { ALT: () => $.CONSUME(tokens.Different) }])
    );

    $.RULE("relationalOperator", () => {
      $.OR([
        { ALT: () => $.CONSUME(tokens.Greater) },
        { ALT: () => $.CONSUME(tokens.Less) },
        { ALT: () => $.CONSUME(tokens.GreaterOrEqual) },
        { ALT: () => $.CONSUME(tokens.LessOrEqual) },
      ]);
    });

    $.RULE("shiftOperator", () => {
      $.OR([
        { ALT: () => $.CONSUME(tokens.ShiftLeft) },
        { ALT: () => $.CONSUME(tokens.ShiftRight) },
        { ALT: () => $.CONSUME(tokens.UnsignedShiftRight) },
      ]);
    });

    $.RULE("additiveOperator", () =>
      $.OR([{ ALT: () => $.CONSUME(tokens.Plus) }, { ALT: () => $.CONSUME(tokens.Minus) }])
    );

    $.RULE("multiplicativeOperator", () => {
      $.OR([
        { ALT: () => $.CONSUME(tokens.Multiplication) },
        { ALT: () => $.CONSUME(tokens.Division) },
        { ALT: () => $.CONSUME(tokens.Modulo) },
      ]);
    });

    $.RULE("prefixOperator", () =>
      $.OR2([{ ALT: () => $.CONSUME(tokens.DoublePlus) }, { ALT: () => $.CONSUME(tokens.DoubleMinus) }])
    );

    $.RULE("postfixOperator", () =>
      $.OR2([{ ALT: () => $.CONSUME(tokens.DoublePlus) }, { ALT: () => $.CONSUME(tokens.DoubleMinus) }])
    );

    $.RULE("unaryOperator", () => {
      $.OR3([
        { ALT: () => $.CONSUME(tokens.Tilda) },
        { ALT: () => $.CONSUME(tokens.Exclamation) },
        { ALT: () => $.CONSUME(tokens.Plus) },
        { ALT: () => $.CONSUME(tokens.Minus) },
      ]);
    });

    /**
     * Function parameters declaration
     */
    $.RULE("functionParameterDeclarationList", () => {
      $.CONSUME(tokens.ParenthesisOpen);
      $.OR([
        { ALT: () => $.CONSUME(tokens.Void) },
        {
          ALT: () =>
            $.MANY_SEP({
              SEP: tokens.Comma,
              DEF: () => $.SUBRULE($.functionParameterDeclaration),
            }),
        },
      ]);
      $.CONSUME(tokens.ParenthesisClose);
    });

    /**
     * Single function parameter declaration
     */
    $.RULE("functionParameterDeclaration", () => {
      $.OPTION3(() => $.CONSUME(tokens.Local));
      $.OPTION7(() => $.CONSUME(tokens.Const));
      $.SUBRULE($.typeNameWithoutVoid); // Parameter type
      $.OPTION(() => $.CONSUME(tokens.BinaryAnd));
      $.CONSUME1(tokens.Identifier); // Parameter name
      $.OPTION2(() => {
        $.CONSUME(tokens.BracketOpen);
        $.CONSUME(tokens.BracketClose);
      });
    });

    /**
     * Represents any number, in any representation (binary, octal, decimal, hexadecimal)
     */
    $.RULE("number", () => {
      $.OR([
        { ALT: () => $.CONSUME(tokens.NumberBinaryLiteral) },
        { ALT: () => $.CONSUME(tokens.NumberOctalLiteral) },
        { ALT: () => $.CONSUME(tokens.NumberDecimalLiteral) },
        { ALT: () => $.CONSUME(tokens.NumberHexadecimalLiteral) },
        { ALT: () => $.CONSUME(tokens.NumberHexadecimalLiteral2) },
      ]);
    });

    /**
     * Represents any type (void being included)
     */
    $.RULE("typeName", () => {
      $.OR([{ ALT: () => $.CONSUME(tokens.Void) }, { ALT: () => $.SUBRULE($.typeNameWithoutVoid) }]);
    });

    /**
     * Represents any concrete type (void being excluded)
     */
    $.RULE("typeNameWithoutVoid", () => {
      $.OR2([
        { ALT: () => $.CONSUME(tokens.Signed) },
        { ALT: () => $.CONSUME(tokens.Unsigned) },
        { ALT: () => $.CONSUME(tokens.Struct) },
        { ALT: () => {} },
      ]);
      $.CONSUME2(tokens.Identifier);
      $.OPTION(() => {
        $.CONSUME(tokens.BracketOpen);
        $.CONSUME(tokens.BracketClose);
      });
    });

    this.performSelfAnalysis();
  }
}
module.exports = SweetscapeParser;
