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
    });

    const $ = this;

    $.RULE("definition", () => {
      $.MANY(() => $.SUBRULE($.topLevelStatement));
    });

    $.RULE("topLevelStatement", () => {
      $.OR([
        {
          ALT: () => $.SUBRULE($.functionDeclarationStatement),
        },
        {
          ALT: () => $.SUBRULE($.emptyStructStatement),
        },
        {
          ALT: () => $.SUBRULE($.topLevelDirective),
        },
        {
          ALT: () => $.SUBRULE($.statement),
        },
      ]);
    });

    $.RULE("topLevelDirective", () => {
      $.CONSUME(tokens.DirectiveDefineToken);
      $.CONSUME(tokens.IdentifierToken);
      $.OR([
        { ALT: () => $.SUBRULE($.Number) },
        { ALT: () => $.SUBRULE($.StringLiteral) },
        {
          ALT: () =>
            $.MANY(() =>
              $.OR2([
                // TODO Type name rule?
                { ALT: () => $.CONSUME1(tokens.IdentifierToken) },
                { ALT: () => $.CONSUME1(tokens.SignedToken) },
                { ALT: () => $.CONSUME1(tokens.UnsignedToken) },
              ])
            ),
        },
      ]);
      // TODO Parenthesis around numbers shall be supported
    });

    $.RULE("simpleDirective", () => {
      $.OR([
        {
          ALT: () => {
            $.CONSUME(tokens.DirectiveIfdefToken);
            $.CONSUME2(tokens.IdentifierToken);
          },
        },
        {
          ALT: () => {
            $.CONSUME(tokens.DirectiveEndifToken);
          },
        },
      ]);
    });

    $.RULE("statementList", () => {
      $.MANY(() => {
        $.SUBRULE($.statement);
      });
    });

    $.RULE("block", () => {
      $.CONSUME(tokens.CurlyBraceOpenToken);
      $.SUBRULE($.statementList);
      $.CONSUME(tokens.CurlyBraceCloseToken);
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
        { ALT: () => $.CONSUME(tokens.SemiColonToken) },
        { ALT: () => $.SUBRULE($.simpleDirective) },
      ]);
    });

    $.RULE("functionDeclarationStatement", () => {
      $.CONSUME(tokens.IdentifierToken); // Return type
      $.CONSUME1(tokens.IdentifierToken); // Function name
      $.SUBRULE($.parameterDeclarationList);
      $.CONSUME(tokens.CurlyBraceOpenToken);
      $.SUBRULE($.statementList);
      $.CONSUME(tokens.CurlyBraceCloseToken);
    });

    $.RULE("localVariableDeclarationStatement", () => {
      $.MANY(() => $.SUBRULE($.variableModifier));
      $.SUBRULE($.type);
      $.OR([
        {
          ALT: () => {
            $.SUBRULE($.variableDeclarators);
          },
        },
        {
          ALT: () => {
            $.SUBRULE2($.bitfieldRest);
          },
        },
      ]);
      $.CONSUME(tokens.SemiColonToken);
    });

    $.RULE("bitfieldRest", () => {
      $.CONSUME(tokens.ColonToken);
      $.SUBRULE($.Number);
    });

    $.RULE("typedefStatement", () => {
      $.CONSUME(tokens.TypedefToken);
      $.SUBRULE($.type); // Type
      $.CONSUME2(tokens.IdentifierToken); // Alias
      $.OPTION3(() => $.SUBRULE($.identifierSuffix));
      $.OPTION4(() => $.SUBRULE($.selector));
      $.OPTION2(() => $.SUBRULE($.annotations));
      $.CONSUME(tokens.SemiColonToken);
    });

    $.RULE("emptyStructStatement", () => {
      $.OR2([{ ALT: () => $.CONSUME(tokens.StructToken) }, { ALT: () => $.CONSUME(tokens.UnionToken) }]);
      $.CONSUME3(tokens.IdentifierToken);
      $.CONSUME(tokens.SemiColonToken);
    });

    $.RULE("structStatement", () => {
      $.OPTION(() => $.CONSUME(tokens.TypedefToken));
      $.OR2([{ ALT: () => $.CONSUME(tokens.StructToken) }, { ALT: () => $.CONSUME(tokens.UnionToken) }]);
      $.OR([
        {
          ALT: () => {
            $.SUBRULE2($.structDeclaration);
            $.OPTION4(() => $.SUBRULE($.variableDeclarator));
          },
        },
        {
          ALT: () => {
            $.CONSUME3(tokens.IdentifierToken); // Alias
            $.SUBRULE($.structDeclaration);
            $.OPTION5(() => $.SUBRULE2($.variableDeclarator));
          },
        },
      ]);
      $.OPTION3(() => $.SUBRULE2($.annotations));
      $.CONSUME(tokens.SemiColonToken);
    });

    $.RULE("enumStatement", () => {
      $.OPTION(() => $.CONSUME(tokens.TypedefToken));
      $.CONSUME(tokens.EnumToken);
      $.OPTION2(() => {
        $.CONSUME(tokens.LessToken);
        // TODO Create a subrule for type reference
        $.OPTION7(() => $.CONSUME(tokens.UnsignedToken));
        $.OPTION8(() => $.CONSUME(tokens.SignedToken));
        $.CONSUME(tokens.IdentifierToken); // Base type
        $.CONSUME(tokens.GreaterToken);
      });
      $.OR([
        {
          ALT: () => {
            $.CONSUME1(tokens.IdentifierToken); // Type name
            $.OPTION6(() => $.SUBRULE($.enumDeclaration));
            $.OPTION4(() => $.SUBRULE($.variableDeclarator));
          },
        },
        {
          ALT: () => {
            $.SUBRULE2($.enumDeclaration);
            $.OPTION5(() => $.SUBRULE2($.variableDeclarator));
          },
        },
      ]);
      $.OPTION3(() => $.SUBRULE($.annotations));
      $.CONSUME(tokens.SemiColonToken);
    });

    $.RULE("structDeclaration", () => {
      $.OPTION(() => $.SUBRULE($.parameterDeclarationList));
      $.CONSUME(tokens.CurlyBraceOpenToken);
      $.SUBRULE($.statementList);
      $.CONSUME(tokens.CurlyBraceCloseToken);
    });

    $.RULE("enumDeclaration", () => {
      $.CONSUME(tokens.CurlyBraceOpenToken);
      $.SUBRULE($.enumElementDeclaration);
      $.MANY(() => {
        $.CONSUME(tokens.CommaToken);
        $.SUBRULE2($.enumElementDeclaration);
      });
      $.OPTION2(() => $.CONSUME2(tokens.CommaToken));
      $.CONSUME(tokens.CurlyBraceCloseToken);
    });

    $.RULE("enumElementDeclaration", () => {
      $.CONSUME(tokens.IdentifierToken);
      $.OPTION(() => {
        $.CONSUME(tokens.EqualsToken);
        $.SUBRULE($.expression);
      });
    });

    $.RULE("annotations", () => {
      $.CONSUME(tokens.LessToken);
      $.MANY_SEP({
        SEP: tokens.CommaToken,
        DEF: () => {
          $.CONSUME(tokens.IdentifierToken); // Key
          $.CONSUME(tokens.EqualsToken);
          $.OR([
            { ALT: () => $.CONSUME2(tokens.IdentifierToken) },
            { ALT: () => $.SUBRULE($.StringLiteral) },
            { ALT: () => $.SUBRULE($.Number) },
          ]);
        },
      });
      $.CONSUME(tokens.GreaterToken);
    });

    $.RULE("ifStatement", () => {
      $.CONSUME(tokens.IfToken);
      $.SUBRULE($.parExpression);
      $.SUBRULE($.statement);
      $.OPTION(() => {
        $.CONSUME(tokens.ElseToken);
        $.SUBRULE2($.statement);
      });
    });

    $.RULE("doWhileStatement", () => {
      $.CONSUME(tokens.DoToken);
      $.SUBRULE($.block);
      $.CONSUME(tokens.WhileToken);
      $.SUBRULE($.parExpression);
      $.CONSUME(tokens.SemiColonToken);
    });

    $.RULE("whileStatement", () => {
      $.CONSUME(tokens.WhileToken);
      $.SUBRULE($.parExpression);
      $.SUBRULE($.statement);
    });

    $.RULE("forStatement", () => {
      $.CONSUME(tokens.ForToken);
      $.CONSUME(tokens.ParenthesisOpenToken);
      $.SUBRULE($.forInitUpdate);
      $.CONSUME2(tokens.SemiColonToken);
      $.OPTION(() => $.SUBRULE($.expression));
      $.CONSUME3(tokens.SemiColonToken);
      $.SUBRULE2($.forInitUpdate);
      $.CONSUME(tokens.ParenthesisCloseToken);
      $.SUBRULE($.statement);
    });

    $.RULE("forInitUpdate", () => {
      $.MANY_SEP({
        SEP: tokens.CommaToken,
        DEF: () => $.SUBRULE($.expression),
      });
    });

    $.RULE("switchStatement", () => {
      $.CONSUME(tokens.SwitchToken);
      $.SUBRULE($.parExpression);
      $.CONSUME(tokens.CurlyBraceOpenToken);
      $.MANY(() => $.SUBRULE($.switchBlockStatementGroup));
      $.CONSUME(tokens.CurlyBraceCloseToken);
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
              $.CONSUME(tokens.CaseToken);
              $.OR2([
                { ALT: () => $.SUBRULE($.Number) },
                { ALT: () => $.CONSUME(tokens.IdentifierToken) },
                { ALT: () => $.SUBRULE($.StringLiteral) },
              ]);
            },
          },
          {
            ALT: () => {
              $.CONSUME(tokens.DefaultToken);
            },
          },
        ]);
        $.CONSUME(tokens.ColonToken);
      });
    });

    $.RULE("breakStatement", () => {
      $.CONSUME(tokens.BreakToken);
      $.CONSUME(tokens.SemiColonToken);
    });

    $.RULE("returnStatement", () => {
      $.CONSUME(tokens.ReturnToken);
      $.OPTION(() => $.SUBRULE($.expression));
      $.CONSUME(tokens.SemiColonToken);
    });

    $.RULE("parExpression", () => {
      $.CONSUME(tokens.ParenthesisOpenToken);
      $.SUBRULE($.expression);
      $.CONSUME(tokens.ParenthesisCloseToken);
    });

    $.RULE("parExpressionOrCastExpression", () => {
      $.CONSUME(tokens.ParenthesisOpenToken);
      $.SUBRULE($.expression);
      $.CONSUME2(tokens.ParenthesisCloseToken);
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
      $.CONSUME(tokens.SemiColonToken);
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
      $.CONSUME(tokens.QuestionToken);
      $.SUBRULE($.expression);
      $.CONSUME(tokens.ColonToken);
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
            $.CONSUME(tokens.SizeofToken);
            $.CONSUME(tokens.ParenthesisOpenToken);
            $.OPTION3(() => $.CONSUME(tokens.StructToken));
            $.CONSUME(tokens.IdentifierToken);
            $.CONSUME(tokens.ParenthesisCloseToken);
          },
        },
      ]);
    });

    $.RULE("variableModifier", () => {
      $.OR([{ ALT: () => $.CONSUME(tokens.LocalToken) }, { ALT: () => $.CONSUME(tokens.ConstToken) }]);
    });

    $.RULE("type", () => {
      $.OR([
        {
          ALT: () => {
            $.OPTION2(() => {
              $.OR2([
                { ALT: () => $.CONSUME(tokens.UnsignedToken) },
                { ALT: () => $.CONSUME(tokens.SignedToken) },
                { ALT: () => $.CONSUME(tokens.StructToken) },
              ]);
            });
            $.CONSUME(tokens.IdentifierToken);
            $.OPTION(() => {
              $.CONSUME(tokens.BracketOpenToken);
              $.CONSUME(tokens.BracketCloseToken);
            });
          },
        },
      ]);
    });

    $.RULE("variableDeclarators", () => {
      $.AT_LEAST_ONE_SEP({
        SEP: tokens.CommaToken,
        DEF: () => $.SUBRULE($.variableDeclarator),
      });
    });

    $.RULE("variableDeclarator", () => {
      $.CONSUME(tokens.IdentifierToken);
      $.SUBRULE($.variableDeclaratorRest);
      $.OPTION(() => $.SUBRULE($.bitfieldRest));
      $.OPTION2(() => $.SUBRULE($.annotations));
    });

    $.RULE("variableDeclaratorRest", () => {
      $.OR([
        {
          ALT: () => {
            $.CONSUME(tokens.BracketOpenToken);
            $.OPTION(() => $.SUBRULE($.expression));
            $.CONSUME(tokens.BracketCloseToken);
          },
        },
        {
          ALT: () => {
            // Be careful to avoid duplication with the function declaration rule
            $.CONSUME(tokens.ParenthesisOpenToken);
            $.MANY_SEP({
              SEP: tokens.CommaToken,
              DEF: () => $.SUBRULE($.primary),
            });
            $.CONSUME(tokens.ParenthesisCloseToken);
          },
        },
        { ALT: () => {} },
      ]);
      $.OPTION3(() => $.SUBRULE($.annotations));
      $.OPTION2(() => {
        $.CONSUME(tokens.EqualsToken);
        $.SUBRULE($.variableInitializer);
      });
    });

    $.RULE("variableInitializer", () => {
      // TODO ArrayInitializer
      $.SUBRULE($.expression);
    });

    $.RULE("selector", () => {
      // TODO Many other alternatives
      $.OR([
        {
          ALT: () => {
            $.CONSUME(tokens.PeriodToken);
            $.CONSUME(tokens.IdentifierToken);
            $.OPTION(() => $.SUBRULE($.arguments));
          },
        },
        {
          ALT: () => {
            $.CONSUME(tokens.BracketOpenToken);
            $.SUBRULE($.expression);
            $.CONSUME(tokens.BracketCloseToken);
          },
        },
      ]);
    });

    $.RULE("primary", () => {
      $.OR([
        {
          ALT: () => $.SUBRULE($.Number),
        },
        {
          ALT: () => $.SUBRULE($.StringLiteral),
        },
        {
          ALT: () => $.SUBRULE($.parExpressionOrCastExpression),
        },
        {
          ALT: () => {
            // TODO Identifier { . Identifier } [IdentifierSuffix]
            $.CONSUME(tokens.IdentifierToken);
            $.OPTION(() => $.SUBRULE($.identifierSuffix));
          },
        },
      ]);
    });

    $.RULE("identifierSuffix", () => {
      // TODO: Other things?
      $.SUBRULE($.arguments);
    });

    $.RULE("arguments", () => {
      $.CONSUME(tokens.ParenthesisOpenToken);
      $.MANY_SEP({
        SEP: tokens.CommaToken,
        DEF: () => $.SUBRULE($.expression),
      });
      $.CONSUME(tokens.ParenthesisCloseToken);
    });

    $.RULE("assignmentOperator", () => {
      $.OR([
        { ALT: () => $.CONSUME(tokens.EqualsToken) },
        { ALT: () => $.CONSUME(tokens.MultiplicationEqualsToken) },
        { ALT: () => $.CONSUME(tokens.DivisionEqualsToken) },
        { ALT: () => $.CONSUME(tokens.ModuloEqualsToken) },
        { ALT: () => $.CONSUME(tokens.PlusEqualsToken) },
        { ALT: () => $.CONSUME(tokens.MinusEqualsToken) },
        { ALT: () => $.CONSUME(tokens.ShiftLeftEqualsToken) },
        { ALT: () => $.CONSUME(tokens.ShiftRightEqualsToken) },
        { ALT: () => $.CONSUME(tokens.UnsignedShiftRightEqualsToken) },
        { ALT: () => $.CONSUME(tokens.BinaryAndEqualsToken) },
        { ALT: () => $.CONSUME(tokens.BinaryXorEqualsToken) },
        { ALT: () => $.CONSUME(tokens.BinaryOrEqualsToken) },
      ]);
    });

    $.RULE("infixOperator", () => {
      $.OR([
        { ALT: () => $.CONSUME(tokens.BooleanAndToken) },
        { ALT: () => $.CONSUME(tokens.BooleanOrToken) },
        { ALT: () => $.CONSUME(tokens.BinaryOrToken) },
        { ALT: () => $.CONSUME(tokens.BinaryXorToken) },
        { ALT: () => $.CONSUME(tokens.BinaryAndToken) },
        { ALT: () => $.CONSUME(tokens.DoubleEqualsToken) },
        { ALT: () => $.CONSUME(tokens.DifferentToken) },
        { ALT: () => $.CONSUME(tokens.GreaterToken) },
        { ALT: () => $.CONSUME(tokens.LessToken) },
        { ALT: () => $.CONSUME(tokens.GreaterOrEqualToken) },
        { ALT: () => $.CONSUME(tokens.LessOrEqualToken) },
        { ALT: () => $.CONSUME(tokens.ShiftLeftToken) },
        { ALT: () => $.CONSUME(tokens.ShiftRightToken) },
        { ALT: () => $.CONSUME(tokens.UnsignedShiftRightToken) },
        { ALT: () => $.CONSUME(tokens.PlusToken) },
        { ALT: () => $.CONSUME(tokens.MinusToken) },
        { ALT: () => $.CONSUME(tokens.MultiplicationToken) },
        { ALT: () => $.CONSUME(tokens.DivisionToken) },
        { ALT: () => $.CONSUME(tokens.ModuloToken) },
      ]);
    });

    $.RULE("prefixOperator", () => {
      $.OR([
        { ALT: () => $.CONSUME(tokens.PlusToken) },
        { ALT: () => $.CONSUME(tokens.MinusToken) },
        { ALT: () => $.CONSUME(tokens.DoublePlusToken) },
        { ALT: () => $.CONSUME(tokens.DoubleMinusToken) },
        { ALT: () => $.CONSUME(tokens.TildaToken) },
        { ALT: () => $.CONSUME(tokens.ExclamationToken) },
      ]);
    });

    $.RULE("postfixOperator", () => {
      $.OR([
        { ALT: () => $.CONSUME(tokens.DoublePlusToken) },
        { ALT: () => $.CONSUME(tokens.DoubleMinusToken) },
      ]);
    });

    $.RULE("assignmentExpression", () => {
      $.CONSUME(tokens.IdentifierToken);
      $.CONSUME(tokens.EqualsToken);
      $.SUBRULE($.expression);
    });

    $.RULE("parameterDeclarationList", () => {
      $.CONSUME(tokens.ParenthesisOpenToken);
      $.MANY_SEP({
        SEP: tokens.CommaToken,
        DEF: () => {
          // TODO Support "void" keyword
          // TODO Better type handling?
          $.OPTION3(() => $.CONSUME(tokens.LocalToken));
          $.OPTION4(() => $.CONSUME(tokens.StructToken));
          $.OPTION5(() => $.CONSUME(tokens.UnsignedToken));
          $.OPTION6(() => $.CONSUME(tokens.SignedToken));
          $.CONSUME(tokens.IdentifierToken); // Parameter type
          $.OPTION(() => $.CONSUME(tokens.BinaryAndToken));
          $.CONSUME1(tokens.IdentifierToken); // Parameter name
          $.OPTION2(() => {
            $.CONSUME(tokens.BracketOpenToken);
            $.CONSUME(tokens.BracketCloseToken);
          });
        },
      });
      $.CONSUME(tokens.ParenthesisCloseToken);
    });

    $.RULE("Number", () => {
      $.OR([
        { ALT: () => $.CONSUME(tokens.NumberOctalLiteralToken) },
        { ALT: () => $.CONSUME(tokens.NumberDecimalLiteralToken) },
        { ALT: () => $.CONSUME(tokens.NumberHexadecimalLiteralToken) },
        { ALT: () => $.CONSUME(tokens.NumberBinaryLiteralToken) },
      ]);
    });

    $.RULE("StringLiteral", () => {
      $.OR([{ ALT: () => $.CONSUME(tokens.StringLiteralToken) }]);
    });

    this.performSelfAnalysis();
  }
}
module.exports = SweetscapeParser;
