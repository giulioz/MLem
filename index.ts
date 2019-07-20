import { readFileSync } from "fs";
import { Parser, Grammar } from "nearley";
import * as grammar from "./grammar";

type Scope = {
  bindings: { [ident: string]: Expression };
  types: { [name: string]: any };
  schemas: any;
};

type IdentExpression = { type: "ident"; name: string };
type TypeExpression = {
  type: "type";
  ident: string;
  value: { [ident: string]: string[] };
  in: Expression;
};
type MatchExpression = { type: "match"; value: Expression; cases: MatchCase[] };
type MatchCase = { case: Expression; value: Expression };
type LetExpression = {
  type: "let";
  ident: string;
  value: Expression;
  in: Expression;
};
type TupleExpression = { type: "tuple"; items: Expression[] };
type LambdaExpression = {
  type: "lambda";
  variable: string;
  value: Expression | BuiltinExpFunction;
  scope?: Scope;
  returnType?: string;
};
type BuiltinExpFunction = (scope: Scope) => Expression;
type AppExpression = {
  type: "app";
  fn: Expression;
  param: Expression;
};
type StringExpression = { type: "string"; value: StringChain };
type StringChain = { value: string; next?: StringChain };
type NumberExpression = { type: "number"; value: number };

type Expression =
  | IdentExpression
  | TypeExpression
  | MatchExpression
  | LetExpression
  | TupleExpression
  | LambdaExpression
  | AppExpression
  | StringExpression
  | NumberExpression;

function joinString(exp: StringChain) {
  if (exp.next === undefined) {
    return exp.value;
  } else {
    return exp.value + joinString(exp.next);
  }
}

const builtIn: Scope = {
  types: [],
  schemas: [],
  bindings: {
    inc: {
      type: "lambda",
      variable: "x",
      value: (scope: Scope) => ({
        type: "number",
        value: (scope.bindings["x"] as NumberExpression).value + 1
      }),
      returnType: "number"
    },
    sum: {
      type: "lambda",
      variable: "x",
      value: {
        type: "lambda",
        variable: "y",
        value: (scope: Scope) => ({
          type: "number",
          value:
            (scope.bindings["x"] as NumberExpression).value +
            (scope.bindings["y"] as NumberExpression).value
        }),
        returnType: "number"
      }
    },
    neg: {
      type: "lambda",
      variable: "x",
      value: (scope: Scope) => ({
        type: "number",
        value: -(scope.bindings["x"] as NumberExpression).value
      }),
      returnType: "number"
    }
    // readFile: {
    //   type: "lambda",
    //   variable: "fileName",
    //   value: (scope: Scope) => ({
    //     type: "string",
    //     value: readFileSync(
    //       joinString((scope.bindings["fileName"] as StringExpression).value),
    //       "utf8"
    //     ),
    //     returnType: "string"
    //   })
    // }
  }
};

function typeEquals(ta, tb, scope: Scope) {
  if (!ta || !tb || ta.type !== tb.type) {
    return false;
  }

  switch (ta.type) {
    case "number":
      return true;
    case "tuple":
      return ta.every((v, i) => typeEquals(tb[i], v, scope));
  }
}

function getType(exp, scope) {
  switch (exp.type) {
    case "number":
      return { type: "number" };

    case "tuple":
      return { type: "tuple", items: exp.items.map(ti => getType(ti, scope)) };

    case "ident":
      if (scope.bindings[exp.name] !== undefined) {
        return scope.bindings[exp.name];
      } else {
        throw new Error("No identifier " + exp.name);
      }

    case "app": {
      const param = getType(exp.param, scope);
      const fn = getType(exp.fn, scope);

      const newScope = {
        bindings: {
          ...scope.bindings,
          ...(fn.scope ? fn.scope.bindings : {}),
          [fn.variable]: param
        },
        types: {
          ...scope.types,
          ...(fn.scope ? fn.scope.types : {})
        },
        schemas: {
          ...scope.schemas,
          ...(fn.scope ? fn.scope.schemas : {})
        }
      };

      if (!typeEquals(fn.paramType, param, scope)) {
        throw new Error("Type mismatch in function");
      }

      return getType(fn.value, newScope);
    }

    case "let": {
      const valueType = getType(exp.value, scope);

      return getType(exp.in, {
        bindings: { ...scope.bindings, [exp.ident]: valueType },
        types: scope.types,
        schemas: scope.schemas
      });
    }

    case "type":
      function buildConstructor(name, data) {
        if (data.length <= 0) {
          return { type: exp.ident, value: name };
        } else {
          return {
            type: "lambda",
            paramType: {
              type: "tuple",
              items: data.map(ti => getType(ti, scope))
            },
            value: { type: exp.ident, value: name }
          };
        }
      }

      const constructors = Object.keys(exp.value).reduce(
        (prev, v) => ({ ...prev, [v]: buildConstructor(v, exp.value[v]) }),
        {}
      );

      return getType(exp.in, {
        ...scope,
        bindings: { ...scope.bindings, ...constructors },
        types: { ...scope.types, [exp.ident]: exp.value }
      });

    case "lambda":
      return { ...exp, scope, paramType: null };
  }
}

function evaluate(exp: Expression, scope: Scope): Expression {
  switch (exp.type) {
    case "tuple":
      return {
        type: "tuple",
        items: exp.items.map(item => evaluate(item, scope))
      };

    case "ident":
      if (scope.bindings[exp.name] === undefined) {
        throw new Error("No identifier " + exp.name);
      }
      return scope.bindings[exp.name];

    case "app": {
      const param = evaluate(exp.param, scope);
      const fn = evaluate(exp.fn, scope);
      if (fn.type !== "lambda") {
        throw new Error("Not a function");
      }

      const newScope = {
        ...scope,
        bindings: {
          ...scope.bindings,
          ...(fn.scope ? fn.scope.bindings : {}),
          [fn.variable]: param
        },
        types: {
          ...scope.types,
          ...(fn.scope ? fn.scope.types : {})
        }
      };

      if (typeof fn.value === "function") {
        // Builtin
        return fn.value(newScope);
      } else {
        return evaluate(fn.value, newScope);
      }
    }

    case "let": {
      const value = evaluate(exp.value, scope);
      const newScope = {
        ...scope,
        bindings: { ...scope.bindings, [exp.ident]: value }
      };
      // console.log("LET: ", exp.ident, " = ", value);

      return evaluate(exp.in, newScope);
    }

    case "type": {
      function buildConstructor(
        exp: TypeExpression,
        name: string,
        data: string[]
      ) {
        if (data.length <= 0) {
          return { type: exp.ident, value: name };
        } else {
          return {
            type: "lambda",
            variable: "_data",
            value: (scope: Scope) => ({
              type: exp.ident,
              name,
              data: scope.bindings["_data"]
            })
          };
        }
      }

      const constructors = Object.keys(exp.value).reduce(
        (prev, v) => ({ ...prev, [v]: buildConstructor(exp, v, exp.value[v]) }),
        {}
      );

      return evaluate(exp.in, {
        ...scope,
        bindings: { ...scope.bindings, ...constructors },
        types: { ...scope.types, [exp.ident]: exp.value }
      });
    }

    case "lambda":
      // Lift lambda
      return { ...exp, scope };

    case "match": {
      function matchCase(value: Expression, c: MatchCase): Expression | null {
        if (c.case === undefined) {
          return evaluate(c.value, scope);
        } else if (c.case.type === "ident") {
          return evaluate(c.value, {
            ...scope,
            bindings: { ...scope.bindings, [c.case.name]: value }
          });
        } else if (
          c.case.type === "app" &&
          c.case.fn.type == "ident" &&
          scope.bindings[c.case.fn.name] !== undefined &&
          (value as any).name === c.case.fn.name
        ) {
          // HACK
          return matchCase((value as any).data, {
            case: c.case.param,
            value: c.value
          });
        } else if (c.case.type !== value.type) {
          return null;
        } else if (
          c.case.type === "number" &&
          value.type === "number" &&
          c.case.value === value.value
        ) {
          return evaluate(c.value, scope);
        } else if (
          c.case.type === "string" &&
          value.type === "string" &&
          joinString(c.case.value) === joinString(value.value)
        ) {
          return evaluate(c.value, scope);
        } else if (
          c.case.type === "tuple" &&
          value.type === "tuple" &&
          c.case.items.length === value.items.length
        ) {
          const tupleMatches = c.case.items.map((caseItem, i) =>
            matchCase(value.items[i], { case: caseItem, value: c.value })
          );

          if (tupleMatches.some(v => v === null)) {
            return null;
          } else {
            return {
              type: "tuple",
              items: tupleMatches
            };
          }
        } else {
          return null;
        }
      }

      const value = evaluate(exp.value, scope);
      for (const c of exp.cases) {
        const result = matchCase(value, c);
        if (result !== null) {
          return result;
        }
      }

      throw new Error("No case match");
    }

    default:
      return exp;
  }
}

const parser = new Parser(Grammar.fromCompiled(grammar));
parser.feed(readFileSync(process.argv[2], "utf8"));
if (parser.results.length > 1) {
  console.log("Warning! Ambiguous syntax");
}

const value = evaluate(parser.results[0], builtIn);
console.log("Value: ", JSON.stringify(value, null, 2));
// const type = getType(parser.results[0], builtIn);
// console.log("Type: ", type);
