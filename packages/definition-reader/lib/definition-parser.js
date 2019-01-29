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
        $.OR([
          {
            ALT: () => $.SUBRULE($.structureClause),
          },
          {
            ALT: () => $.SUBRULE($.enumClause),
          },
        ]);
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

    $.RULE("enumClause", () => {
      $.CONSUME(tokens.EnumToken);
      $.CONSUME(tokens.IdentifierToken);
      $.CONSUME(tokens.CurlyBraceOpenToken);
      $.MANY_SEP({
        SEP: tokens.CommaToken,
        DEF: () => {
          $.CONSUME1(tokens.IdentifierToken);
          $.CONSUME1(tokens.EqualsToken);
          $.SUBRULE($.numberClause);
        },
      });
      $.CONSUME(tokens.CurlyBraceCloseToken);
    });

    $.RULE("valueClause", () => {
      $.OR([
        {
          ALT: () => $.CONSUME(tokens.StringLiteralToken),
        },
        {
          ALT: () => $.SUBRULE($.numberClause),
        },
      ]);
    });

    $.RULE("fieldClause", () => {
      $.CONSUME(tokens.IdentifierToken);
      $.OPTION(() => {
        $.CONSUME(tokens.ColonToken);
        $.SUBRULE($.numberClause);
      });
      $.CONSUME1(tokens.IdentifierToken);
      $.OPTION1(() => {
        $.SUBRULE($.BoxMemberExpression);
      });
      $.CONSUME(tokens.SemiColonToken);
    });

    $.RULE("numberClause", () => {
      $.OR([
        {
          ALT: () => $.CONSUME(tokens.NumberHexadecimalLiteralToken),
        },
        {
          ALT: () => $.CONSUME(tokens.NumberDecimalLiteralToken),
        },
      ]);
    });

    $.RULE("PrimaryExpression", () => {
      $.OR(
        $.c5 ||
          ($.c5 = [
            {
              ALT: () => $.CONSUME(tokens.IdentifierToken),
            },
            {
              ALT: () => $.SUBRULE($.numberClause),
            },
            {
              ALT: () => $.SUBRULE($.ArrayLiteral),
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
      $.MANY(() => $.SUBRULE($.ArrayLiteralContent));
      $.CONSUME(tokens.BracketCloseToken);
    });
    $.RULE("ArrayLiteralContent", () => {
      $.OR([
        {
          ALT: () => $.SUBRULE($.ElementList),
        },
        {
          ALT: () => $.SUBRULE($.Elision),
        },
      ]);
    });
    $.RULE("ElementList", () => {
      $.SUBRULE($.AssignmentExpression);
      $.MANY(() => $.SUBRULE($.ElementListEntry));
    });
    $.RULE("ElementListEntry", () => {
      $.SUBRULE2($.Elision);
      $.SUBRULE2($.AssignmentExpression);
    });
    $.RULE("Elision", () => {
      $.AT_LEAST_ONE(() => {
        $.CONSUME(tokens.CommaToken);
      });
    });
    $.RULE("MemberCallNewExpression", () => {
      $.SUBRULE($.PrimaryExpression);
      $.MANY2(() => {
        $.SUBRULE($.MemberCallNewExpressionExtension);
      });
    });
    $.RULE("MemberCallNewExpressionExtension", () => {
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
                ALT: () => $.CONSUME(tokens.DifferentToken),
              },
              {
                ALT: () => $.CONSUME(tokens.DoubleDifferentToken),
              },
              {
                ALT: () => $.CONSUME(tokens.ShiftRightToken),
              },
              {
                ALT: () => $.CONSUME(tokens.UnsignedShiftRightToken),
              },
              {
                ALT: () => $.CONSUME(tokens.MultiplicationToken),
              },
              {
                ALT: () => $.CONSUME(tokens.PlusToken),
              },
              {
                ALT: () => $.CONSUME(tokens.MinusToken),
              },
            ])
        );
        $.SUBRULE2($.UnaryExpression);
      });
    });

    $.RULE("AssignmentExpression", () => {
      $.SUBRULE($.BinaryExpression);
      $.OPTION(() => {
        $.CONSUME(tokens.QuestionToken);
        $.SUBRULE($.AssignmentExpression);
        $.CONSUME(tokens.ColonToken);
        $.SUBRULE2($.AssignmentExpression);
      });
    });

    $.RULE("Expression", () => {
      $.SUBRULE($.AssignmentExpression);
      $.MANY(() => {
        $.CONSUME(tokens.CommaToken);
        $.SUBRULE2($.AssignmentExpression);
      });
    });

    this.performSelfAnalysis();
  }
}

module.exports = DefinitionParser;
