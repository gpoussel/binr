"use strict";

const _ = require("lodash");

function getVisitor(parser) {
  class Visitor extends parser.getBaseCstVisitorConstructorWithDefaults() {
    constructor() {
      super();
      this.validateVisitor();
    }

    definition(ctx) {
      return {
        type: "definition",
        content: _.map(ctx.topLevelStatement, this.visit.bind(this)),
      };
    }

    topLevelStatement(ctx) {
      if (_.has(ctx, "statement")) {
        // Statement at the top-level
        return {
          type: "statement",
          content: this.visit(ctx.functionDeclarationStatement),
        };
      }
      if (_.has(ctx, "functionDeclarationStatement")) {
        return this.visit(ctx.functionDeclarationStatement);
      }
      if (_.has(ctx, "emptyStructStatement")) {
        return this.visit(ctx.emptyStructStatement);
      }
      throw new Error();
    }

    functionDeclarationStatement(ctx) {
      const {
        typeName,
        Identifier: identifiers,
        functionParameterDeclarationList
      } = ctx;
      const forwardDeclaration = _.has(ctx, "SemiColon");
      return {
        type: "functionDeclaration",
        returnType: this.visit(typeName),
        name: _.first(identifiers).image,
        parameters: this.visit(functionParameterDeclarationList),
        forwardDeclaration,
        content: forwardDeclaration ? {} : this.visit(ctx.statementList),
      };
    }

    typeName(ctx) {
      if (_.has(ctx, "typeNameWithoutVoid")) {
        return this.visit(ctx.typeNameWithoutVoid);
      }
      if (_.has(ctx, "Void")) {
        return {
          name: "void"
        };
      }
      throw new Error();
    }

    typeNameWithoutVoid(ctx) {
      const simpleName = _.first(ctx.Identifier).image;
      const nameParts = [];
      if (_.has(ctx, "Signed")) {
        nameParts.push("signed");
      }
      if (_.has(ctx, "Unsigned")) {
        nameParts.push("unsigned");
      }
      nameParts.push(simpleName);
      return {
        name: _.join(nameParts, " "),
        array: _.has(ctx, "BracketOpen"),
      };
    }

    functionParameterDeclarationList(ctx) {
      if (_.has(ctx, "Void")) {
        return [];
      }
      return _.map(ctx.functionParameterDeclaration, this.visit.bind(this));
    }

    functionParameterDeclaration(ctx) {
      const type = this.visit(ctx.typeNameWithoutVoid);
      if (_.has(ctx, "BracketOpen")) {
        type.array = true;
      }
      return {
        type,
        reference: _.has(ctx, "BinaryAnd"),
        name: _.first(ctx.Identifier).image,
      };
    }

    statementList(ctx) {
      // TODO
    }

    emptyStructStatement(ctx) {
      // TODO
    }
  }

  return new Visitor();
}
module.exports = {
  getVisitor
};
