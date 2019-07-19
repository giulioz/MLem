"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const nearley_1 = require("nearley");
const grammar = require("./grammar");
function joinString(exp) {
    if (exp.next === undefined) {
        return exp.value;
    }
    else {
        return exp.value + joinString(exp.next);
    }
}
const builtIn = {
    types: [],
    schemas: [],
    bindings: {
        inc: {
            type: "lambda",
            variable: "x",
            value: (scope) => scope.bindings["x"] + 1,
            returnType: "number"
        },
        sum: {
            type: "lambda",
            variable: "x",
            value: {
                type: "lambda",
                variable: "y",
                value: (scope) => scope.bindings["x"] + scope.bindings["y"],
                returnType: "number"
            }
        },
        readFile: {
            type: "lambda",
            variable: "fileName",
            value: (scope) => ({
                type: "string",
                value: fs_1.readFileSync(joinString(scope.bindings["fileName"]), "utf8"),
                returnType: "string"
            })
        }
    }
};
function typeEquals(ta, tb, scope) {
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
            }
            else {
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
                }
                else {
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
            const constructors = Object.keys(exp.value).reduce((prev, v) => ({ ...prev, [v]: buildConstructor(v, exp.value[v]) }), {});
            return getType(exp.in, {
                ...scope,
                bindings: { ...scope.bindings, ...constructors },
                types: { ...scope.types, [exp.ident]: exp.value }
            });
        case "lambda":
            return { ...exp, scope, paramType: null };
    }
}
function evaluate(exp, scope) {
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
            }
            else {
                return evaluate(fn.value, newScope);
            }
        }
        case "let": {
            const value = evaluate(exp.value, scope);
            const newScope = {
                ...scope,
                bindings: { ...scope.bindings, [exp.ident]: value }
            };
            return evaluate(exp.in, newScope);
        }
        case "type": {
            function buildConstructor(exp, name, data) {
                if (data.length <= 0) {
                    return { type: exp.ident, value: name };
                }
                else {
                    return {
                        type: "lambda",
                        variable: "_data",
                        value: (scope) => ({
                            type: exp.ident,
                            name,
                            value: {
                                type: exp.ident,
                                value: name,
                                data: scope.bindings["_data"]
                            }
                        })
                    };
                }
            }
            const constructors = Object.keys(exp.value).reduce((prev, v) => ({ ...prev, [v]: buildConstructor(exp, v, exp.value[v]) }), {});
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
            function matchCase(value, c) {
                if (c === undefined) {
                    return scope;
                }
                else if (c.type === "ident") {
                    if (scope.bindings[c.name] === undefined) {
                        // new ident
                        return {
                            ...scope,
                            bindings: {
                                ...scope.bindings,
                                [c.name]: value
                            }
                        };
                    }
                    else {
                        // custom type: TODO
                        return null;
                    }
                }
                else if (c.type !== value.type) {
                    return null;
                }
                else if (c.type === "number" &&
                    value.type === "number" &&
                    c.value === value.value) {
                    return scope;
                }
                else if (c.type === "string" &&
                    value.type === "string" &&
                    joinString(c.value) === joinString(value.value)) {
                    return scope;
                }
                else if (c.type === "tuple" &&
                    value.type === "tuple" &&
                    c.items.length === value.items.length) {
                    const tupleMatches = c.items.map((caseItem, i) => matchCase(value.items[i], caseItem));
                    if (tupleMatches.some(v => v === null)) {
                        return null;
                    }
                    else {
                        return {
                            ...scope,
                            bindings: {
                                ...scope.bindings,
                                ...tupleMatches.reduce((bnds, scope) => ({ ...bnds, ...scope.bindings }), {})
                            }
                        };
                    }
                }
                else {
                    return null;
                }
            }
            const value = evaluate(exp.value, scope);
            const mcases = exp.cases
                .map(c => [matchCase(value, c.case), c.value])
                .filter(v => v[0] !== null);
            const [firstCaseScope, firstCaseValue] = mcases[0];
            if (firstCaseScope === undefined) {
                throw new Error("No case match");
            }
            else {
                return evaluate(firstCaseValue, firstCaseScope);
            }
        }
        default:
            return exp;
    }
}
const parser = new nearley_1.Parser(nearley_1.Grammar.fromCompiled(grammar));
parser.feed(fs_1.readFileSync("test.mml", "utf8"));
if (parser.results.length > 1) {
    console.log("Warning! Ambiguous syntax");
}
const value = evaluate(parser.results[0], builtIn);
console.log("Value: ", value);
// const type = getType(parser.results[0], builtIn);
// console.log("Type: ", type);
