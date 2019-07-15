const fs = require("fs");
const nearley = require("nearley");
const grammar = require("./grammar.js");

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

parser.feed(fs.readFileSync("test.mml", "utf8"));

if (parser.results.length > 1) {
  console.log("Error! Indecidible syntax");
}

const builtIn = {
  inc: x => x + 1
};

function evaluate(exp, scope) {
  switch (exp.type) {
    case "number":
    case "string":
    case "boolean":
      return exp.value;

    case "ident":
      if (scope[exp.name] === undefined) {
        throw new Error("No identifier ", exp.name);
      }

      return scope[exp.name];

    case "app":
      const param = evaluate(exp.param, scope);

      if (exp.fn.type === "lambda") {
        return evaluate(exp.fn.value, {
          ...scope,
          [exp.fn.variable]: param
        });
      } else if (exp.fn.type === "ident") {
        const fn = evaluate(exp.fn, scope);

        if (typeof fn === "function") {
          return fn(param);
        } else {
          return evaluate(exp.fn.value, {
            ...scope,
            [exp.fn.variable]: param
          });
        }
      } else {
        throw new Error("Not a function");
      }

    case "let":
      const value = evaluate(exp.value, scope);

      return evaluate(exp.in, {
        ...scope,
        [exp.ident]: value
      });

    case "lambda":
      return exp;
  }
}

const value = evaluate(parser.results[0], builtIn);
console.log(value);
