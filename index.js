const fs = require("fs");
const nearley = require("nearley");
const grammar = require("./grammar.js");

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

parser.feed(fs.readFileSync("test.mml", "utf8"));

if (parser.results.length > 1) {
  console.log("Error! Indecidible syntax");
}

function joinString(exp) {
  if (exp.next === undefined) {
    return exp.value;
  } else {
    return exp.value + joinString(exp.next);
  }
}

const builtIn = {
  bindings: {
    inc: {
      type: "lambda",
      variable: "x",
      value: scope => scope.bindings["x"] + 1
    },
    sum: {
      type: "lambda",
      variable: "x",
      value: {
        type: "lambda",
        variable: "y",
        value: scope => scope.bindings["x"] + scope.bindings["y"]
      }
    },
    readFile: {
      type: "lambda",
      variable: "fileName",
      value: scope => ({
        type: "string",
        value: fs.readFileSync(joinString(scope.bindings["fileName"]), "utf8")
      })
    }
  }
};

function evaluate(exp, scope) {
  switch (exp.type) {
    case "tuple":
      return exp.items.map(item => evaluate(item, scope));

    case "ident":
      if (scope.bindings[exp.name] !== undefined) {
        return scope.bindings[exp.name];
      } else {
        throw new Error("No identifier " + exp.name);
      }

    case "app": {
      const param = evaluate(exp.param, scope);
      const fn = evaluate(exp.fn, scope);
      const newScope = {
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

      return evaluate(exp.in, {
        bindings: { ...scope.bindings, [exp.ident]: value },
        types: scope.types
      });
    }

    case "type": {
      function buildConstructor(name, data) {
        if (data.length <= 0) {
          return { type: exp.ident, name, value: null };
        } else {
          return {
            type: "lambda",
            variable: "_data",
            value: scope => ({
              type: exp.ident,
              name,
              value: scope.bindings["_data"]
            })
          };
        }
      }

      const constructors = Object.keys(exp.value).reduce(
        (prev, v) => ({ ...prev, [v]: buildConstructor(v, exp.value[v]) }),
        {}
      );

      return evaluate(exp.in, {
        bindings: { ...scope.bindings, ...constructors },
        types: { ...scope.types, [exp.ident]: exp.value }
      });
    }

    case "lambda":
      // Lift lambda
      return { ...exp, scope };

    case "match": {
      function matchesCase(value, c) {
        return c.case === undefined || value.value == c.case.value;
      }

      const value = evaluate(exp.value, scope);
      const mcases = exp.cases.filter(c => matchesCase(value, c));

      const firstCase = mcases[0];
      if (firstCase === undefined) {
        throw new Error("No case match");
      } else {
        return evaluate(firstCase.value, scope);
      }
    }

    default:
      return exp.value;
  }
}

const value = evaluate(parser.results[0], builtIn);
console.log(value);
