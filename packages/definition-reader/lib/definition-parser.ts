import { CstParser } from "chevrotain";
import { values } from "lodash";
import { tokens } from "./definition-lexer";

export class DefinitionParser extends CstParser {
  public definition = this.RULE("definition", () => {
    this.MANY(() => {
      this.SUBRULE(this.headerClause);
    });
    this.MANY1(() => {
      this.SUBRULE(this.topLevelClause);
    });
  });
  private c1: any;
  private c2: any;
  private c3: any;
  private c4: any;

  private topLevelClause = this.RULE("topLevelClause", () => {
    this.MANY2(() => {
      this.SUBRULE(this.annotationClause);
    });
    this.OR([
      {
        ALT: () => this.SUBRULE(this.structureClause),
      },
      {
        ALT: () => this.SUBRULE(this.enumClause),
      },
      {
        ALT: () => this.SUBRULE(this.bitmaskClause),
      },
    ]);
  });

  private headerClause = this.RULE("headerClause", () => {
    this.CONSUME(tokens.HashToken);
    this.CONSUME(tokens.IdentifierToken);
    this.SUBRULE(this.valueClause);
  });

  private annotationClause = this.RULE("annotationClause", () => {
    this.CONSUME(tokens.AtToken);
    this.CONSUME(tokens.IdentifierToken);
    this.CONSUME(tokens.ParenthesisOpenToken);
    this.SUBRULE(this.valueClause);
    this.CONSUME(tokens.ParenthesisCloseToken);
  });

  private structureClause = this.RULE("structureClause", () => {
    this.OPTION(() => {
      this.CONSUME(tokens.ExportToken);
    });
    this.CONSUME(tokens.StructToken);
    this.CONSUME(tokens.IdentifierToken);
    this.CONSUME(tokens.CurlyBraceOpenToken);
    this.MANY2(() => {
      this.SUBRULE(this.statementClause);
    });
    this.CONSUME(tokens.CurlyBraceCloseToken);
  });

  private enumClause = this.RULE("enumClause", () => {
    this.CONSUME(tokens.EnumToken);
    this.CONSUME(tokens.IdentifierToken);
    this.CONSUME(tokens.ExtendsToken);
    this.SUBRULE(this.typeReferenceClause);
    this.CONSUME(tokens.CurlyBraceOpenToken);
    this.MANY_SEP({
      SEP: tokens.CommaToken,
      DEF: () => {
        this.CONSUME1(tokens.IdentifierToken);
        this.CONSUME1(tokens.EqualsToken);
        this.SUBRULE(this.numberClause);
      },
    });
    this.CONSUME(tokens.CurlyBraceCloseToken);
  });

  private bitmaskClause = this.RULE("bitmaskClause", () => {
    this.CONSUME(tokens.BitmaskToken);
    this.CONSUME(tokens.IdentifierToken);
    this.CONSUME(tokens.ExtendsToken);
    this.SUBRULE(this.typeReferenceClause);
    this.CONSUME(tokens.CurlyBraceOpenToken);
    this.MANY_SEP({
      SEP: tokens.CommaToken,
      DEF: () => {
        this.CONSUME1(tokens.IdentifierToken);
        this.CONSUME1(tokens.EqualsToken);
        this.SUBRULE(this.numberClause);
      },
    });
    this.CONSUME(tokens.CurlyBraceCloseToken);
  });

  private valueClause = this.RULE("valueClause", () => {
    this.OR([
      {
        ALT: () => this.CONSUME(tokens.StringLiteralToken),
      },
      {
        ALT: () => this.SUBRULE(this.numberClause),
      },
      {
        ALT: () => this.CONSUME(tokens.TrueToken),
      },
      {
        ALT: () => this.CONSUME(tokens.FalseToken),
      },
    ]);
  });

  private statementClause = this.RULE("statementClause", () => {
    this.OR(
      this.c2 ||
        (this.c2 = [
          {
            ALT: () => this.SUBRULE(this.BlockStatement),
          },
          {
            ALT: () => this.SUBRULE(this.IfStatement),
          },
          {
            ALT: () => this.SUBRULE(this.SwitchStatement),
          },
          {
            ALT: () => this.SUBRULE(this.fieldClause),
          },
        ]),
    );
  });

  private switchInnerClause = this.RULE("switchInnerClause", () => {
    this.SUBRULE(this.valueClause);
    this.CONSUME(tokens.DoubleArrowToken);
    this.SUBRULE(this.BlockStatement);
  });

  private BlockStatement = this.RULE("BlockStatement", () => {
    this.CONSUME(tokens.CurlyBraceOpenToken);
    this.MANY(() => {
      this.SUBRULE(this.statementClause);
    });
    this.CONSUME(tokens.CurlyBraceCloseToken);
  });

  private IfStatement = this.RULE("IfStatement", () => {
    this.CONSUME(tokens.IfToken);
    this.CONSUME(tokens.ParenthesisOpenToken);
    this.SUBRULE(this.Expression);
    this.CONSUME(tokens.ParenthesisCloseToken);
    this.SUBRULE(this.statementClause);
    this.OPTION(() => {
      this.CONSUME(tokens.ElseToken);
      this.SUBRULE2(this.statementClause);
    });
  });

  private SwitchStatement = this.RULE("SwitchStatement", () => {
    this.CONSUME(tokens.SwitchToken);
    this.CONSUME(tokens.ParenthesisOpenToken);
    this.SUBRULE(this.Expression);
    this.CONSUME(tokens.ParenthesisCloseToken);
    this.CONSUME(tokens.CurlyBraceOpenToken);
    this.MANY_SEP({
      SEP: tokens.CommaToken,
      DEF: () => {
        this.SUBRULE(this.switchInnerClause);
      },
    });
    this.CONSUME(tokens.CurlyBraceCloseToken);
  });

  private fieldClause = this.RULE("fieldClause", () => {
    this.MANY(() => {
      this.SUBRULE(this.annotationClause);
    });
    this.SUBRULE(this.typeReferenceClause);
    this.CONSUME1(tokens.IdentifierToken);
    this.OPTION1(() => {
      this.OR([
        {
          ALT: () => this.SUBRULE(this.BoxMemberExpression),
        },
        {
          ALT: () => this.SUBRULE(this.BoxMemberUntilExpression),
        },
      ]);
    });
    this.CONSUME(tokens.SemiColonToken);
  });

  private typeReferenceClause = this.RULE("typeReferenceClause", () => {
    this.CONSUME(tokens.IdentifierToken);
    this.OPTION(() => {
      this.CONSUME(tokens.ColonToken);
      this.SUBRULE(this.numberClause);
    });
  });

  private numberClause = this.RULE("numberClause", () => {
    this.OR([
      {
        ALT: () => this.CONSUME(tokens.NumberHexadecimalLiteralToken),
      },
      {
        ALT: () => this.CONSUME(tokens.NumberBinaryLiteralToken),
      },
      {
        ALT: () => this.CONSUME(tokens.NumberDecimalLiteralToken),
      },
    ]);
  });

  private PrimaryExpression = this.RULE("PrimaryExpression", () => {
    this.OR(
      this.c4 ||
        (this.c4 = [
          {
            ALT: () => this.CONSUME(tokens.IdentifierToken),
          },
          {
            ALT: () => this.SUBRULE(this.numberClause),
          },
          {
            ALT: () => this.CONSUME(tokens.StringLiteralToken),
          },
          {
            ALT: () => this.SUBRULE(this.ArrayLiteral),
          },
          {
            ALT: () => this.SUBRULE(this.ParenthesisExpression),
          },
        ]),
    );
  });
  private ParenthesisExpression = this.RULE("ParenthesisExpression", () => {
    this.CONSUME(tokens.ParenthesisOpenToken);
    this.SUBRULE(this.Expression);
    this.CONSUME(tokens.ParenthesisCloseToken);
  });
  private ArrayLiteral = this.RULE("ArrayLiteral", () => {
    this.CONSUME(tokens.BracketOpenToken);
    this.MANY(() => this.SUBRULE(this.ArrayLiteralContent));
    this.CONSUME(tokens.BracketCloseToken);
  });
  private ArrayLiteralContent = this.RULE("ArrayLiteralContent", () => {
    this.OR([
      {
        ALT: () => this.SUBRULE(this.ElementList),
      },
      {
        ALT: () => this.SUBRULE(this.Elision),
      },
    ]);
  });
  private ElementList = this.RULE("ElementList", () => {
    this.SUBRULE(this.AssignmentExpression);
    this.MANY(() => this.SUBRULE(this.ElementListEntry));
  });
  private ElementListEntry = this.RULE("ElementListEntry", () => {
    this.SUBRULE2(this.Elision);
    this.SUBRULE2(this.AssignmentExpression);
  });
  private Elision = this.RULE("Elision", () => {
    this.AT_LEAST_ONE(() => {
      this.CONSUME(tokens.CommaToken);
    });
  });
  private MemberCallNewExpression = this.RULE("MemberCallNewExpression", () => {
    this.SUBRULE(this.PrimaryExpression);
    this.MANY2(() => {
      this.SUBRULE(this.MemberCallNewExpressionExtension);
    });
  });
  private MemberCallNewExpressionExtension = this.RULE("MemberCallNewExpressionExtension", () => {
    this.OR2([
      {
        ALT: () => this.SUBRULE(this.BoxMemberExpression),
      },
      {
        ALT: () => this.SUBRULE(this.DotMemberExpression),
      },
      {
        ALT: () => this.SUBRULE(this.Arguments),
      },
    ]);
  });
  private BoxMemberExpression = this.RULE("BoxMemberExpression", () => {
    this.CONSUME(tokens.BracketOpenToken);
    this.SUBRULE(this.Expression);
    this.CONSUME(tokens.BracketCloseToken);
  });
  private BoxMemberUntilExpression = this.RULE("BoxMemberUntilExpression", () => {
    this.CONSUME(tokens.BracketOpenToken);
    this.CONSUME(tokens.UntilToken);
    this.SUBRULE(this.Expression);
    this.CONSUME(tokens.BracketCloseToken);
  });

  private DotMemberExpression = this.RULE("DotMemberExpression", () => {
    this.CONSUME(tokens.PeriodToken);
    this.CONSUME(tokens.IdentifierToken);
  });
  private Arguments = this.RULE("Arguments", () => {
    this.CONSUME(tokens.ParenthesisOpenToken);
    this.OPTION(() => {
      this.SUBRULE(this.AssignmentExpression);
      this.MANY(() => {
        this.CONSUME(tokens.CommaToken);
        this.SUBRULE2(this.AssignmentExpression);
      });
    });
    this.CONSUME(tokens.ParenthesisCloseToken);
  });
  private PostfixExpression = this.RULE("PostfixExpression", () => {
    this.SUBRULE(this.MemberCallNewExpression);
    this.OPTION({
      DEF: () => {
        this.OR([
          {
            ALT: () => this.CONSUME(tokens.DoublePlusToken),
          },
          {
            ALT: () => this.CONSUME(tokens.DoubleMinusToken),
          },
        ]);
      },
    });
  });
  private UnaryExpression = this.RULE("UnaryExpression", () => {
    this.OR([
      {
        ALT: () => this.SUBRULE(this.PostfixExpression),
      },
      {
        ALT: () => {
          this.OR2(
            this.c1 ||
              (this.c1 = [
                {
                  ALT: () => this.CONSUME(tokens.DoublePlusToken),
                },
                {
                  ALT: () => this.CONSUME(tokens.DoubleMinusToken),
                },
                {
                  ALT: () => this.CONSUME(tokens.PlusToken),
                },
                {
                  ALT: () => this.CONSUME(tokens.MinusToken),
                },
                {
                  ALT: () => this.CONSUME(tokens.TildaToken),
                },
                {
                  ALT: () => this.CONSUME(tokens.ExclamationToken),
                },
              ]),
          );
          this.SUBRULE(this.UnaryExpression);
        },
      },
    ]);
  });

  private BinaryExpression = this.RULE("BinaryExpression", () => {
    this.SUBRULE(this.UnaryExpression);
    this.MANY(() => {
      this.SUBRULE2(this.ExpressionToken);
      this.SUBRULE3(this.UnaryExpression);
    });
  });

  private ExpressionToken = this.RULE("ExpressionToken", () => {
    this.OR(
      this.c3 ||
        (this.c3 = [
          { ALT: () => this.CONSUME(tokens.BooleanOrToken) },
          { ALT: () => this.CONSUME(tokens.BooleanAndToken) },
          { ALT: () => this.CONSUME(tokens.BinaryOrToken) },
          { ALT: () => this.CONSUME(tokens.BinaryXorToken) },
          { ALT: () => this.CONSUME(tokens.BinaryAndToken) },
          { ALT: () => this.CONSUME(tokens.DoubleEqualsToken) },
          { ALT: () => this.CONSUME(tokens.DifferentToken) },
          { ALT: () => this.CONSUME(tokens.ShiftRightToken) },
          { ALT: () => this.CONSUME(tokens.ShiftLeftToken) },
          { ALT: () => this.CONSUME(tokens.UnsignedShiftRightToken) },
          { ALT: () => this.CONSUME(tokens.GreaterToken) },
          { ALT: () => this.CONSUME(tokens.LessToken) },
          { ALT: () => this.CONSUME(tokens.MultiplicationToken) },
          { ALT: () => this.CONSUME(tokens.DivisionToken) },
          { ALT: () => this.CONSUME(tokens.PlusToken) },
          { ALT: () => this.CONSUME(tokens.MinusToken) },
          { ALT: () => this.CONSUME(tokens.ModuloToken) },
        ]),
    );
  });

  private AssignmentExpression = this.RULE("AssignmentExpression", () => {
    this.SUBRULE(this.BinaryExpression);
    this.OPTION(() => {
      this.CONSUME(tokens.QuestionToken);
      this.SUBRULE(this.AssignmentExpression);
      this.CONSUME(tokens.ColonToken);
      this.SUBRULE2(this.AssignmentExpression);
    });
  });

  private Expression = this.RULE("Expression", () => {
    this.SUBRULE(this.AssignmentExpression);
  });

  constructor() {
    super(values(tokens), {
      recoveryEnabled: true,
    });
    this.c1 = undefined;
    this.c2 = undefined;
    this.c3 = undefined;
    this.c4 = undefined;
    this.c4 = undefined;

    this.performSelfAnalysis();
  }
}
