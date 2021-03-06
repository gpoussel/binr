import { CstParser } from "chevrotain";
import { each, filter, get, has, join, keys, map, repeat, size, times } from "lodash";

import { BlockNode, FieldNode, IfNode, SwitchNode } from "./nodes";

/**
 * This is the mapping between Binr symbols and Javascript ones
 */
const SYMBOL_MAPPING = {
  "==": "===",
  "!=": "!==",
};

export function getVisitor(parser: CstParser) {
  class Visitor extends parser.getBaseCstVisitorConstructorWithDefaults() {
    constructor() {
      super();
      this.validateVisitor();
    }

    public definition(ctx: any) {
      return {
        headers: map(ctx.headerClause, this.visit.bind(this)),
        structures: map(
          filter(ctx.topLevelClause, (c) => has(c, "children.structureClause")),
          this.visit.bind(this),
        ),
        enumerations: map(
          filter(ctx.topLevelClause, (c) => has(c, "children.enumClause")),
          this.visit.bind(this),
        ),
        bitmasks: map(
          filter(ctx.topLevelClause, (c) => has(c, "children.bitmaskClause")),
          this.visit.bind(this),
        ),
      };
    }

    public topLevelClause(ctx: any) {
      const annotations = map(ctx.annotationClause, this.visit.bind(this));
      if (has(ctx, "structureClause")) {
        const { name, exported, statements } = this.visit(ctx.structureClause);
        return {
          name,
          exported,
          statements,
          annotations,
        };
      }
      if (has(ctx, "enumClause")) {
        const { name, entries, parentType } = this.visit(ctx.enumClause);
        return {
          name,
          entries,
          parentType,
          annotations,
        };
      }
      if (has(ctx, "bitmaskClause")) {
        const { name, entries, parentType } = this.visit(ctx.bitmaskClause);
        return {
          name,
          entries,
          parentType,
          annotations,
        };
      }
    }

    public headerClause(ctx: any) {
      const name = this.getIdentifierName(ctx.IdentifierToken[0]);
      const value = this.visit(ctx.valueClause[0]);
      return {
        name,
        value,
      };
    }

    public annotationClause(ctx: any) {
      const name = this.getIdentifierName(ctx.IdentifierToken[0]);
      const value = this.visit(ctx.valueClause[0]);
      return {
        name,
        value,
      };
    }

    public enumClause(ctx: any) {
      const name = this.getIdentifierName(ctx.IdentifierToken[0]);
      const entries = times(ctx.IdentifierToken.length - 1, (i) => ({
        key: this.getIdentifierName(ctx.IdentifierToken[i + 1]),
        value: this.visit(ctx.numberClause[i]),
      }));
      const parentType = this.visit(ctx.typeReferenceClause);
      return {
        name,
        entries,
        parentType,
      };
    }

    public bitmaskClause(ctx: any) {
      const name = this.getIdentifierName(ctx.IdentifierToken[0]);
      const entries = times(ctx.IdentifierToken.length - 1, (i) => ({
        key: this.getIdentifierName(ctx.IdentifierToken[i + 1]),
        value: this.visit(ctx.numberClause[i]),
      }));
      const parentType = this.visit(ctx.typeReferenceClause);
      return {
        name,
        entries,
        parentType,
      };
    }

    public structureClause(ctx: any) {
      const exported = has(ctx, "ExportToken");
      const name = this.getIdentifierName(ctx.IdentifierToken[0]);
      const statements = map(ctx.statementClause, this.visit.bind(this));
      return {
        name,
        exported,
        statements,
      };
    }

    public statementClause(ctx: any) {
      if (has(ctx, "fieldClause")) {
        return this.visit(ctx.fieldClause);
      }
      if (has(ctx, "IfStatement")) {
        return this.visit(ctx.IfStatement);
      }
      if (has(ctx, "BlockStatement")) {
        return this.visit(ctx.BlockStatement);
      }
      if (has(ctx, "SwitchStatement")) {
        return this.visit(ctx.SwitchStatement);
      }
    }

    public IfStatement(ctx: any) {
      return new IfNode(
        this.visit(ctx.Expression[0]),
        this.visit(ctx.statementClause[0]),
        size(ctx.statementClause) > 1 ? this.visit(get(ctx.statementClause, 1)) : undefined,
      );
    }

    public BlockStatement(ctx: any) {
      return new BlockNode(map(ctx.statementClause, this.visit.bind(this)));
    }

    public SwitchStatement(ctx: any) {
      const testExpression = this.visit(ctx.Expression[0]);
      const switchClauses = map(ctx.switchInnerClause, this.visit.bind(this));
      return new SwitchNode(testExpression, switchClauses);
    }

    public switchInnerClause(ctx: any) {
      const value = this.visit(ctx.valueClause[0]);
      const statement = this.visit(ctx.BlockStatement[0]);
      return {
        value,
        statement,
      };
    }

    public fieldClause(ctx: any) {
      const type = this.visit(ctx.typeReferenceClause);
      const name = this.getIdentifierName(get(ctx.IdentifierToken, 0));
      const annotations = map(ctx.annotationClause, this.visit.bind(this));
      const fieldResult = new FieldNode(type, name, annotations);
      if (has(ctx, "BoxMemberExpression")) {
        const boxMemberDefinition = this.visit(ctx.BoxMemberExpression[0]);
        fieldResult.setArrayDefinition(boxMemberDefinition.substr(1, boxMemberDefinition.length - 2));
      }
      if (has(ctx, "BoxMemberUntilExpression")) {
        fieldResult.setArrayUntilDefinition(this.visit(ctx.BoxMemberUntilExpression[0]));
      }
      return fieldResult;
    }

    public typeReferenceClause(ctx: any) {
      const type = this.getIdentifierName(get(ctx.IdentifierToken, 0));
      if (has(ctx, "ColonToken")) {
        const typeRestriction = this.visit(ctx.numberClause[0]);
        return {
          type,
          typeRestriction,
        };
      }
      return {
        type,
      };
    }

    public valueClause(ctx: any) {
      if (has(ctx, "StringLiteralToken")) {
        return JSON.parse(ctx.StringLiteralToken[0].image);
      }
      if (has(ctx, "TrueToken")) {
        return true;
      }
      if (has(ctx, "FalseToken")) {
        return false;
      }
      // That's a number
      return this.visit(ctx.numberClause[0]);
    }

    public BoxMemberExpression(ctx: any) {
      return `[${this.visit(ctx.Expression)}]`;
    }

    public BoxMemberUntilExpression(ctx: any) {
      return this.visit(ctx.Expression);
    }

    public Expression(ctx: any) {
      if (has(ctx, "AssignmentExpression")) {
        return join(map(ctx.AssignmentExpression, this.visit.bind(this)), ", ");
      }
    }

    public AssignmentExpression(ctx: any) {
      if (has(ctx, "QuestionToken")) {
        const ifElseClause = map(ctx.AssignmentExpression, this.visit.bind(this)).join(" : ");
        return `${this.visit(ctx.BinaryExpression)} ? ${ifElseClause}`;
      }
      if (has(ctx, "BinaryExpression")) {
        return this.visit(ctx.BinaryExpression);
      }
    }

    public BinaryExpression(ctx: any) {
      const result = [this.visit(ctx.UnaryExpression[0])];
      each(ctx.ExpressionToken, (token, i) => {
        const tokenName = keys(token.children)[0];
        const tokenSymbol = token.children[tokenName][0].image;
        const childExpression = this.visit(ctx.UnaryExpression[i + 1]);
        result.push(get(SYMBOL_MAPPING, tokenSymbol, tokenSymbol));
        result.push(childExpression);
      });
      return join(result, " ");
    }

    public UnaryExpression(ctx: any) {
      if (has(ctx, "PostfixExpression")) {
        return this.visit(ctx.PostfixExpression);
      }
      if (has(ctx, "DoublePlusToken")) {
        return `++${this.visit(ctx.UnaryExpression)}`;
      }
      if (has(ctx, "DoubleMinusToken")) {
        return `--${this.visit(ctx.UnaryExpression)}`;
      }
      if (has(ctx, "PlusToken")) {
        return `+${this.visit(ctx.UnaryExpression)}`;
      }
      if (has(ctx, "MinusToken")) {
        return `-${this.visit(ctx.UnaryExpression)}`;
      }
      if (has(ctx, "TildaToken")) {
        return `~${this.visit(ctx.UnaryExpression)}`;
      }
      if (has(ctx, "ExclamationToken")) {
        return `!${this.visit(ctx.UnaryExpression)}`;
      }
    }

    public PostfixExpression(ctx: any) {
      if (has(ctx, "MemberCallNewExpression")) {
        const plusPlusSuffix = has(ctx, "DoublePlusToken") ? "++" : "";
        const minusMinusSuffix = has(ctx, "DoubleMinusToken") ? "--" : "";
        return this.visit(ctx.MemberCallNewExpression) + plusPlusSuffix + minusMinusSuffix;
      }
    }

    public MemberCallNewExpression(ctx: any) {
      if (has(ctx, "PrimaryExpression")) {
        return (
          this.visit(ctx.PrimaryExpression) +
          join(map(ctx.MemberCallNewExpressionExtension, this.visit.bind(this)), "")
        );
      }
    }

    public MemberCallNewExpressionExtension(ctx: any) {
      if (has(ctx, "BoxMemberExpression")) {
        return this.visit(ctx.BoxMemberExpression);
      }
      if (has(ctx, "DotMemberExpression")) {
        return this.visit(ctx.DotMemberExpression);
      }
      if (has(ctx, "Arguments")) {
        return this.visit(ctx.Arguments);
      }
    }

    public Arguments(ctx: any) {
      return `(${join(map(ctx.AssignmentExpression, this.visit.bind(this)))})`;
    }

    public DotMemberExpression(ctx: any) {
      if (has(ctx, "IdentifierToken")) {
        return `.${this.getIdentifierName(ctx.IdentifierToken[0])}`;
      }
    }

    public PrimaryExpression(ctx: any) {
      if (has(ctx, "numberClause")) {
        return this.visit(ctx.numberClause[0]);
      }
      if (has(ctx, "IdentifierToken")) {
        return this.getIdentifierName(ctx.IdentifierToken[0]);
      }
      if (has(ctx, "ParenthesisExpression")) {
        return this.visit(ctx.ParenthesisExpression);
      }
      if (has(ctx, "ArrayLiteral")) {
        return this.visit(ctx.ArrayLiteral);
      }
      if (has(ctx, "StringLiteralToken")) {
        return ctx.StringLiteralToken[0].image;
      }
    }

    public ArrayLiteral(ctx: any) {
      return `[${join(map(ctx.ArrayLiteralContent, this.visit.bind(this)), "")}]`;
    }

    public ArrayLiteralContent(ctx: any) {
      if (has(ctx, "ElementList")) {
        return this.visit(ctx.ElementList);
      }
      if (has(ctx, "Elision")) {
        return this.visit(ctx.Elision);
      }
    }

    public ElementList(ctx: any) {
      const firstElement = this.visit(ctx.AssignmentExpression);
      const otherElements = join(map(ctx.ElementListEntry, this.visit.bind(this)), "");
      return firstElement + otherElements;
    }

    public ElementListEntry(ctx: any) {
      const elision = this.visit(ctx.Elision);
      const entry = this.visit(ctx.AssignmentExpression);
      return elision + entry;
    }

    public Elision(ctx: any) {
      return repeat(",", size(ctx.CommaToken));
    }

    public ParenthesisExpression(ctx: any) {
      return `(${this.visit(ctx.Expression)})`;
    }

    public numberClause(ctx: any) {
      if (has(ctx, "NumberDecimalLiteralToken")) {
        return parseInt(ctx.NumberDecimalLiteralToken[0].image, 10);
      }
      if (has(ctx, "NumberHexadecimalLiteralToken")) {
        return parseInt(ctx.NumberHexadecimalLiteralToken[0].image.substring(2), 16);
      }
      if (has(ctx, "NumberBinaryLiteralToken")) {
        return parseInt(ctx.NumberBinaryLiteralToken[0].image.substring(2), 2);
      }
    }

    public getIdentifierName(identifier: any) {
      return identifier.image;
    }
  }
  return new Visitor();
}
