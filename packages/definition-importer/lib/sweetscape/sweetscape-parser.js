"use strict";

const _ = require("lodash");
const chevrotain = require("chevrotain");
const { tokens } = require("./sweetscape-lexer");

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
      $.MANY(() => {
        $.SUBRULE($.statement);
      });
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
        {
          ALT: () => {
            $.SUBRULE($.variableDeclarators);
          },
        },
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
      $.OR([
        { ALT: () => $.SUBRULE($.number) },
        {
          ALT: () => {
            $.CONSUME(tokens.Identifier);
            $.OPTION(() => {
              $.SUBRULE($.expression2Rest);
            });
          },
        },
      ]);
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
        $.SUBRULE($.expression);
      });
    });

    $.RULE("annotations", () => {
      $.CONSUME(tokens.Less);
      $.MANY_SEP({
        SEP: tokens.Comma,
        DEF: () => {
          $.CONSUME(tokens.Identifier); // Key
          $.CONSUME(tokens.Equals);
          $.OR([
            { ALT: () => $.CONSUME2(tokens.Identifier) },
            { ALT: () => $.CONSUME(tokens.StringLiteral) },
            { ALT: () => $.SUBRULE($.number) },
          ]);
        },
      });
      $.CONSUME(tokens.Greater);
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
      $.OPTION(() => $.SUBRULE($.expression));
      $.CONSUME3(tokens.SemiColon);
      $.SUBRULE2($.forInitUpdate);
      $.CONSUME(tokens.ParenthesisClose);
      $.SUBRULE($.statement);
    });

    $.RULE("forInitUpdate", () => {
      $.MANY_SEP({
        SEP: tokens.Comma,
        DEF: () => $.SUBRULE($.expression),
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
      $.OPTION(() => $.SUBRULE($.expression));
      $.CONSUME(tokens.SemiColon);
    });

    $.RULE("parExpression", () => {
      $.CONSUME(tokens.ParenthesisOpen);
      $.SUBRULE($.expression);
      $.CONSUME(tokens.ParenthesisClose);
    });

    $.RULE("expressionOrTypeName", () => {
      $.OR([
        { ALT: () => $.SUBRULE($.expression) },
        {
          GATE: () => $.LA(1).tokenType !== tokens.Identifier,
          ALT: () => $.SUBRULE($.typeNameWithoutVoid),
        },
      ]);
    });

    $.RULE("parExpressionOrCastExpression", () => {
      $.CONSUME(tokens.ParenthesisOpen);
      $.SUBRULE($.expressionOrTypeName);
      $.CONSUME2(tokens.ParenthesisClose);
      $.OR2([
        {
          ALT: () => {
            // for potential cast expression
            // or operator expression
            let isOperatorExpression = false;
            $.OPTION4(() => {
              $.SUBRULE($.infixOperator);
              isOperatorExpression = true;
            });
            $.SUBRULE3($.expression);
            $.MANY2({
              GATE: () => isOperatorExpression,
              DEF: () => {
                $.SUBRULE($.expression2Rest);
              },
            });
          },
        },
        {
          // if the first expression is not an identifier, second expression should be empty
          ALT: () => {},
        },
      ]);
    });

    $.RULE("expressionStatement", () => {
      $.SUBRULE($.expression);
      $.CONSUME(tokens.SemiColon);
    });

    $.RULE("expression", () => {
      $.SUBRULE($.expression1);
      $.MANY(() => {
        $.SUBRULE($.assignmentOperator);
        $.SUBRULE1($.expression1);
      });
    });

    $.RULE("expression1", () => {
      $.SUBRULE($.expression2);
      $.OPTION(() => $.SUBRULE($.expression1Rest));
    });

    $.RULE("expression1Rest", () => {
      $.CONSUME(tokens.Question);
      $.SUBRULE($.expression);
      $.CONSUME(tokens.Colon);
      $.SUBRULE($.expression1);
    });

    $.RULE("expression2", () => {
      $.SUBRULE($.expression3);
      $.OPTION(() => $.SUBRULE($.expression2Rest));
    });

    $.RULE("expression2Rest", () => {
      $.MANY(() => {
        $.SUBRULE($.infixOperator);
        $.SUBRULE($.expression3);
      });
    });

    $.RULE("expression3", () => {
      $.OR([
        {
          ALT: () => {
            $.SUBRULE($.prefixOperator);
            $.SUBRULE($.expression3);
          },
        },
        {
          ALT: () => {
            $.SUBRULE($.primary);
            $.MANY(() => $.SUBRULE($.selector));
            $.OPTION2(() => $.SUBRULE($.postfixOperator));
          },
        },
        {
          ALT: () => {
            $.CONSUME(tokens.Sizeof);
            $.CONSUME(tokens.ParenthesisOpen);
            $.SUBRULE($.expressionOrTypeName);
            $.CONSUME(tokens.ParenthesisClose);
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
      $.OPTION(() => {
        // Be careful to avoid duplication with the function declaration rule
        $.CONSUME(tokens.ParenthesisOpen);
        $.MANY_SEP({
          SEP: tokens.Comma,
          DEF: () => $.SUBRULE2($.expression),
        });
        $.CONSUME(tokens.ParenthesisClose);
      });
      $.OPTION1(() => {
        $.CONSUME(tokens.BracketOpen);
        $.OPTION4(() => $.SUBRULE($.expression));
        $.CONSUME(tokens.BracketClose);
      });
      $.OPTION3(() => $.SUBRULE($.annotations));
      $.OPTION2(() => {
        $.CONSUME(tokens.Equals);
        $.SUBRULE($.variableInitializer);
      });
    });

    $.RULE("variableInitializer", () => {
      $.OR([{ ALT: () => $.SUBRULE($.expression) }, { ALT: () => $.SUBRULE($.arrayInitializer) }]);
    });

    $.RULE("arrayInitializer", () => {
      $.CONSUME(tokens.CurlyBraceOpen);
      // No trailing comma supported
      $.AT_LEAST_ONE_SEP({ SEP: tokens.Comma, DEF: () => $.SUBRULE2($.expression) });
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
        {
          ALT: () => {
            $.CONSUME(tokens.BracketOpen);
            $.SUBRULE($.expression);
            $.CONSUME(tokens.BracketClose);
          },
        },
      ]);
    });

    $.RULE("primary", () => {
      $.OR([
        {
          ALT: () => $.SUBRULE($.number),
        },
        {
          ALT: () => $.CONSUME(tokens.StringLiteral),
        },
        {
          ALT: () => $.SUBRULE($.parExpressionOrCastExpression),
        },
        {
          ALT: () => {
            $.CONSUME(tokens.Identifier);
            $.OPTION(() => $.SUBRULE($.identifierSuffix));
          },
        },
      ]);
    });

    $.RULE("identifierSuffix", () => {
      $.SUBRULE($.arguments);
    });

    $.RULE("arguments", () => {
      $.CONSUME(tokens.ParenthesisOpen);
      $.MANY_SEP({
        SEP: tokens.Comma,
        DEF: () => $.SUBRULE($.expression),
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

    $.RULE("infixOperator", () => {
      $.OR([
        { ALT: () => $.CONSUME(tokens.BooleanAnd) },
        { ALT: () => $.CONSUME(tokens.BooleanOr) },
        { ALT: () => $.CONSUME(tokens.BinaryOr) },
        { ALT: () => $.CONSUME(tokens.BinaryXor) },
        { ALT: () => $.CONSUME(tokens.BinaryAnd) },
        { ALT: () => $.CONSUME(tokens.DoubleEquals) },
        { ALT: () => $.CONSUME(tokens.Different) },
        { ALT: () => $.CONSUME(tokens.Greater) },
        { ALT: () => $.CONSUME(tokens.Less) },
        { ALT: () => $.CONSUME(tokens.GreaterOrEqual) },
        { ALT: () => $.CONSUME(tokens.LessOrEqual) },
        { ALT: () => $.CONSUME(tokens.ShiftLeft) },
        { ALT: () => $.CONSUME(tokens.ShiftRight) },
        { ALT: () => $.CONSUME(tokens.UnsignedShiftRight) },
        { ALT: () => $.CONSUME(tokens.Plus) },
        { ALT: () => $.CONSUME(tokens.Minus) },
        { ALT: () => $.CONSUME(tokens.Multiplication) },
        { ALT: () => $.CONSUME(tokens.Division) },
        { ALT: () => $.CONSUME(tokens.Modulo) },
      ]);
    });

    $.RULE("prefixOperator", () => {
      $.OR([
        { ALT: () => $.CONSUME(tokens.Plus) },
        { ALT: () => $.CONSUME(tokens.Minus) },
        { ALT: () => $.CONSUME(tokens.DoublePlus) },
        { ALT: () => $.CONSUME(tokens.DoubleMinus) },
        { ALT: () => $.CONSUME(tokens.Tilda) },
        { ALT: () => $.CONSUME(tokens.Exclamation) },
      ]);
    });

    $.RULE("postfixOperator", () => {
      $.OR([{ ALT: () => $.CONSUME(tokens.DoublePlus) }, { ALT: () => $.CONSUME(tokens.DoubleMinus) }]);
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
