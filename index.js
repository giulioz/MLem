const fs = require("fs");
const nearley = require("nearley");
const grammar = require("./grammar.js");

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

parser.feed(fs.readFileSync("test.mml", "utf8"));

if (parser.results.length > 1) {
  console.log("Error! Indecidible syntax");
}

const builtIn = {
  inc: {
    type: "lambda",
    variable: "x",
    value: scope => scope["x"] + 1
  },
  sum: {
    type: "lambda",
    variable: "x",
    value: {
      type: "lambda",
      variable: "y",
      value: scope => scope["x"] + scope["y"]
    }
  }
};

function evaluate(exp, scope) {
  switch (exp.type) {
    case "number":
    case "string":
    case "boolean":
      return exp.value;

    case "ident":
      if (scope[exp.name] === undefined) {
        throw new Error("No identifier " + exp.name);
      }

      return scope[exp.name];

    case "app":
      const param = evaluate(exp.param, scope);
      const fn = evaluate(exp.fn, scope);
      const newScope = {
        ...scope,
        ...fn.scope,
        [fn.variable]: param
      };

      if (typeof fn.value === "function") {
        // Builtin
        return fn.value(newScope);
      } else {
        return evaluate(fn.value, newScope);
      }

    case "let":
      const value = evaluate(exp.value, scope);

      return evaluate(exp.in, {
        ...scope,
        [exp.ident]: value
      });

    case "lambda":
      // Lift lambda
      return { ...exp, scope };
  }
}

const value = evaluate(parser.results[0], builtIn);
console.log(value);
