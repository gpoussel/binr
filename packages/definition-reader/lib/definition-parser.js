"use strict";

const _ = require("lodash");
const chevrotain = require("chevrotain");
const { tokens } = require("./definition-lexer");

class DefinitionParser extends chevrotain.Parser {
  constructor() {
    super(_.values(tokens), {
      recoveryEnabled: true,
    });
    this.c1 = undefined;
    this.c2 = undefined;
    this.c3 = undefined;
    this.c4 = undefined;
    this.c5 = undefined;

    const $ = this;

    $.RULE("definition", () => {
      $.MANY(() => {
        $.SUBRULE($.headerClause);
      });
      $.MANY1(() => {
        $.SUBRULE($.structureClause);
      });
    });

    $.RULE("headerClause", () => {
      $.CONSUME(tokens.HashToken);
      $.CONSUME(tokens.IdentifierToken);
      $.SUBRULE($.valueClause);
    });

    $.RULE("structureClause", () => {
      $.OPTION(() => {
        $.CONSUME(tokens.ExportToken);
      });
      $.CONSUME(tokens.StructToken);
      $.CONSUME(tokens.IdentifierToken);
      $.CONSUME(tokens.CurlyBraceOpenToken);
      $.MANY(() => {
        $.SUBRULE($.fieldClause);
      });
      $.CONSUME(tokens.CurlyBraceCloseToken);
    });

    $.RULE("valueClause", () => {
      $.OR([
        {
          ALT: () => $.CONSUME(tokens.StringLiteralToken),
        },
        {
          ALT: () => $.CONSUME(tokens.NumberLiteralToken),
        },
      ]);
    });

    $.RULE("fieldClause", () => {
      $.CONSUME(tokens.IdentifierToken);
      $.OPTION(() => {
        $.CONSUME(tokens.ColonToken);
        $.CONSUME(tokens.NumberLiteralToken);
      });
      $.CONSUME1(tokens.IdentifierToken);
      $.OPTION1(() => {
        $.SUBRULE($.BoxMemberExpression);
      });
      $.CONSUME(tokens.SemiColonToken);
    });

    $.RULE("PrimaryExpression", () => {
      $.OR(
        $.c5 ||
          ($.c5 = [
            {
              ALT: () => $.CONSUME(tokens.IdentifierToken),
            },
            {
              ALT: () => $.CONSUME(tokens.NumberLiteralToken),
            },
            {
              ALT: () => $.SUBRULE($.ArrayLiteral),
            },
            {
              ALT: () => $.SUBRULE($.ObjectLiteral),
            },
            {
              ALT: () => $.SUBRULE($.ParenthesisExpression),
            },
          ])
      );
    });
    $.RULE("ParenthesisExpression", () => {
      $.CONSUME(tokens.ParenthesisOpenToken);
      $.SUBRULE($.Expression);
      $.CONSUME(tokens.ParenthesisCloseToken);
    });
    $.RULE("ArrayLiteral", () => {
      $.CONSUME(tokens.BracketOpenToken);
      $.MANY(() => {
        $.SUBRULE($.Elision);
      });
      $.CONSUME(tokens.BracketCloseToken);
    });
    $.RULE("ElementList", () => {
      $.SUBRULE($.AssignmentExpression);
      $.MANY(() => {
        $.SUBRULE2($.Elision);
        $.SUBRULE2($.AssignmentExpression);
      });
    });
    $.RULE("Elision", () => {
      $.AT_LEAST_ONE(() => {
        $.CONSUME(tokens.CommaToken);
      });
    });
    $.RULE("ObjectLiteral", () => {
      $.CONSUME(tokens.CurlyBraceOpenToken);
      $.OPTION(() => {
        $.SUBRULE($.PropertyAssignment);
        $.MANY(() => {
          $.CONSUME(tokens.CommaToken);
          $.SUBRULE2($.PropertyAssignment);
        });
        $.OPTION2(() => {
          $.CONSUME2(tokens.CommaToken);
        });
      });
      $.CONSUME(tokens.CurlyBraceCloseToken);
    });
    $.RULE("PropertyAssignment", () => {
      $.SUBRULE($.PropertyName);
      $.CONSUME(tokens.ColonToken);
      $.SUBRULE($.AssignmentExpression);
    });
    $.RULE("PropertyName", () => {
      $.OR([
        {
          ALT: () => $.CONSUME(tokens.IdentifierToken),
        },
        {
          ALT: () => $.CONSUME(tokens.StringLiteralToken),
        },
        {
          ALT: () => $.CONSUME(tokens.NumberLiteralToken),
        },
      ]);
    });

    $.RULE("MemberCallNewExpression", () => {
      $.SUBRULE($.PrimaryExpression);
      $.MANY2(() => {
        $.OR2([
          {
            ALT: () => $.SUBRULE($.BoxMemberExpression),
          },
          {
            ALT: () => $.SUBRULE($.DotMemberExpression),
          },
          {
            ALT: () => $.SUBRULE($.Arguments),
          },
        ]);
      });
    });
    $.RULE("BoxMemberExpression", () => {
      $.CONSUME(tokens.BracketOpenToken);
      $.SUBRULE($.Expression);
      $.CONSUME(tokens.BracketCloseToken);
    });

    $.RULE("DotMemberExpression", () => {
      $.CONSUME(tokens.PeriodToken);
      $.CONSUME(tokens.IdentifierToken);
    });
    $.RULE("Arguments", () => {
      $.CONSUME(tokens.ParenthesisOpenToken);
      $.OPTION(() => {
        $.SUBRULE($.AssignmentExpression);
        $.MANY(() => {
          $.CONSUME(tokens.CommaToken);
          $.SUBRULE2($.AssignmentExpression);
        });
      });
      $.CONSUME(tokens.ParenthesisCloseToken);
    });
    $.RULE("PostfixExpression", () => {
      $.SUBRULE($.MemberCallNewExpression);
      $.OPTION({
        GATE: this.noLineTerminatorHere,
        DEF: () => {
          $.OR([
            {
              ALT: () => $.CONSUME(tokens.DoublePlusToken),
            },
            {
              ALT: () => $.CONSUME(tokens.DoubleMinusToken),
            },
          ]);
        },
      });
    });
    $.RULE("UnaryExpression", () => {
      $.OR([
        {
          ALT: () => $.SUBRULE($.PostfixExpression),
        },
        {
          ALT: () => {
            $.OR2(
              $.c1 ||
                ($.c1 = [
                  {
                    ALT: () => $.CONSUME(tokens.DoublePlusToken),
                  },
                  {
                    ALT: () => $.CONSUME(tokens.DoubleMinusToken),
                  },
                  {
                    ALT: () => $.CONSUME(tokens.PlusToken),
                  },
                  {
                    ALT: () => $.CONSUME(tokens.MinusToken),
                  },
                  {
                    ALT: () => $.CONSUME(tokens.TildaToken),
                  },
                  {
                    ALT: () => $.CONSUME(tokens.ExclamationToken),
                  },
                ])
            );
            $.SUBRULE($.UnaryExpression);
          },
        },
      ]);
    });

    $.RULE("BinaryExpression", () => {
      $.SUBRULE($.UnaryExpression);
      $.MANY(() => {
        $.OR(
          $.c3 ||
            ($.c3 = [
              {
                ALT: () => $.CONSUME(tokens.BooleanOrToken),
              },
              {
                ALT: () => $.CONSUME(tokens.BooleanAndToken),
              },
              {
                ALT: () => $.CONSUME(tokens.BinaryOrToken),
              },
              {
                ALT: () => $.CONSUME(tokens.BinaryXorToken),
              },
              {
                ALT: () => $.CONSUME(tokens.BinaryAndToken),
              },
              {
                ALT: () => $.CONSUME(tokens.DoubleEqualsToken),
              },
              {
                ALT: () => $.CONSUME(tokens.TripleEqualsToken),
              },
              {
                ALT: () => $.CONSUME(tokens.ShiftRightToken),
              },
              {
                ALT: () => $.CONSUME(tokens.MultiplicationToken),
              },
              {
                ALT: () => $.CONSUME(tokens.PlusToken),
              },
            ])
        );
        $.SUBRULE2($.UnaryExpression);
      });
    });
    $.RULE("BinaryExpressionNoIn", () => {
      $.SUBRULE($.UnaryExpression);
      $.MANY(() => {
        $.OR(
          $.c4 ||
            ($.c4 = [
              {
                ALT: () => $.CONSUME(tokens.BooleanOrToken),
              },
              {
                ALT: () => $.CONSUME(tokens.BooleanAndToken),
              },
              {
                ALT: () => $.CONSUME(tokens.BinaryOrToken),
              },
              {
                ALT: () => $.CONSUME(tokens.BinaryXorToken),
              },
              {
                ALT: () => $.CONSUME(tokens.BinaryAndToken),
              },
              {
                ALT: () => $.CONSUME(tokens.DoubleEqualsToken),
              },
              {
                ALT: () => $.CONSUME(tokens.TripleEqualsToken),
              },
              {
                ALT: () => $.CONSUME(tokens.ShiftRightToken),
              },
              {
                ALT: () => $.CONSUME(tokens.MultiplicationToken),
              },
              {
                ALT: () => $.CONSUME(tokens.PlusToken),
              },
            ])
        );
        $.SUBRULE2($.UnaryExpression);
      });
    });

    // See 11.13
    $.RULE("AssignmentExpression", () => {
      $.SUBRULE($.BinaryExpression);
      $.OPTION(() => {
        $.CONSUME(tokens.QuestionToken);
        $.SUBRULE($.AssignmentExpression);
        $.CONSUME(tokens.ColonToken);
        $.SUBRULE2($.AssignmentExpression);
      });
    });

    // See 11.13
    $.RULE("AssignmentExpressionNoIn", () => {
      $.SUBRULE($.BinaryExpressionNoIn);
      $.OPTION(() => {
        $.CONSUME(tokens.QuestionToken);
        $.SUBRULE($.AssignmentExpression);
        $.CONSUME(tokens.ColonToken);
        $.SUBRULE2($.AssignmentExpressionNoIn);
      });
    });

    // See 11.14
    $.RULE("Expression", () => {
      $.SUBRULE($.AssignmentExpression);
      $.MANY(() => {
        $.CONSUME(tokens.CommaToken);
        $.SUBRULE2($.AssignmentExpression);
      });
    });

    // See 11.14
    $.RULE("ExpressionNoIn", () => {
      $.SUBRULE($.AssignmentExpressionNoIn);
      $.MANY(() => {
        $.CONSUME(tokens.CommaToken);
        $.SUBRULE2($.AssignmentExpressionNoIn);
      });
    });
    this.performSelfAnalysis();
  }
}

module.exports = DefinitionParser;
