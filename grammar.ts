// Generated automatically by nearley, version 2.16.0
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }

    const merge = d => d.join('');
    const nth = n => d => d[n];

export interface Token { value: any; [key: string]: any };

export interface Lexer {
  reset: (chunk: string, info: any) => void;
  next: () => Token | undefined;
  save: () => any;
  formatError: (token: Token) => string;
  has: (tokenType: string) => boolean
};

export interface NearleyRule {
  name: string;
  symbols: NearleySymbol[];
  postprocess?: (d: any[], loc?: number, reject?: {}) => any
};

export type NearleySymbol = string | { literal: any } | { test: (token: any) => boolean };

export var Lexer: Lexer | undefined = undefined;

export var ParserRules: NearleyRule[] = [
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", "wschar"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "__$ebnf$1", "symbols": ["wschar"]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", "wschar"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "wschar", "symbols": [/[ \t\n\v\f]/], "postprocess": id},
    {"name": "file", "symbols": ["_", "exp", "_"], "postprocess": nth(1)},
    {"name": "exp", "symbols": ["exp2"], "postprocess": nth(0)},
    {"name": "exp", "symbols": ["let"], "postprocess": nth(0)},
    {"name": "exp", "symbols": ["type"], "postprocess": nth(0)},
    {"name": "exp2", "symbols": ["exp3"], "postprocess": nth(0)},
    {"name": "exp2", "symbols": ["tuple"], "postprocess": nth(0)},
    {"name": "exp3", "symbols": ["exp4"], "postprocess": nth(0)},
    {"name": "exp3", "symbols": ["match"], "postprocess": nth(0)},
    {"name": "exp4", "symbols": ["exp5"], "postprocess": nth(0)},
    {"name": "exp4", "symbols": ["app"], "postprocess": nth(0)},
    {"name": "exp5", "symbols": ["value"], "postprocess": nth(0)},
    {"name": "exp5", "symbols": ["ident"], "postprocess": d => ({type: "ident", name: d[0]})},
    {"name": "exp5", "symbols": ["lambda"], "postprocess": nth(0)},
    {"name": "exp5", "symbols": ["parens"], "postprocess": nth(0)},
    {"name": "type$string$1", "symbols": [{"literal":"t"}, {"literal":"y"}, {"literal":"p"}, {"literal":"e"}], "postprocess": (d) => d.join('')},
    {"name": "type", "symbols": ["type$string$1", "__", "ident", "_", {"literal":"="}, "_", "typeExp", "sep", "exp"], "postprocess": d => ({type: "type", ident: d[2], value: d[6], in: d[8]})},
    {"name": "typeExp", "symbols": ["typeExp2"], "postprocess": d => d[0]},
    {"name": "typeExp", "symbols": ["typeExp2", "_", {"literal":"|"}, "_", "typeExp"], "postprocess": d => ({...d[0], ...d[4]})},
    {"name": "typeExp2", "symbols": ["ident"], "postprocess": d => ({[d[0]]: []})},
    {"name": "typeExp2$string$1", "symbols": [{"literal":"o"}, {"literal":"f"}], "postprocess": (d) => d.join('')},
    {"name": "typeExp2", "symbols": ["ident", "__", "typeExp2$string$1", "__", "algT"], "postprocess": d => ({[d[0]]: d[4]})},
    {"name": "algT", "symbols": ["ident"], "postprocess": d => [d[0]]},
    {"name": "algT", "symbols": ["ident", "_", {"literal":"*"}, "_", "algT"], "postprocess": d => [d[0], ...d[4]]},
    {"name": "match$string$1", "symbols": [{"literal":"m"}, {"literal":"a"}, {"literal":"t"}, {"literal":"c"}, {"literal":"h"}], "postprocess": (d) => d.join('')},
    {"name": "match$string$2", "symbols": [{"literal":"w"}, {"literal":"i"}, {"literal":"t"}, {"literal":"h"}], "postprocess": (d) => d.join('')},
    {"name": "match$subexpression$1", "symbols": [{"literal":"|"}, "_"]},
    {"name": "match$subexpression$1", "symbols": []},
    {"name": "match", "symbols": ["match$string$1", "__", "exp5", "__", "match$string$2", "__", "match$subexpression$1", "matchCases"], "postprocess": d => ({type: "match", value: d[2], cases: d[7]})},
    {"name": "matchCases", "symbols": ["matchCase"], "postprocess": d => [d[0]]},
    {"name": "matchCases", "symbols": ["matchCase", "msp", "matchCases"], "postprocess": d => [d[0], ...d[2]]},
    {"name": "msp", "symbols": ["_", {"literal":"|"}, "_"]},
    {"name": "matchCase$string$1", "symbols": [{"literal":"-"}, {"literal":">"}], "postprocess": (d) => d.join('')},
    {"name": "matchCase", "symbols": ["exp4", "_", "matchCase$string$1", "_", "exp5"], "postprocess": d => ({case: d[0], value: d[4]})},
    {"name": "matchCase$string$2", "symbols": [{"literal":"-"}, {"literal":">"}], "postprocess": (d) => d.join('')},
    {"name": "matchCase", "symbols": [{"literal":"_"}, "_", "matchCase$string$2", "_", "exp5"], "postprocess": d => ({value: d[4]})},
    {"name": "let$string$1", "symbols": [{"literal":"l"}, {"literal":"e"}, {"literal":"t"}], "postprocess": (d) => d.join('')},
    {"name": "let", "symbols": ["let$string$1", "__", "ident", "_", {"literal":"="}, "_", "exp2", "sep", "exp"], "postprocess": d => ({type: "let", ident: d[2], value: d[6], in: d[8]})},
    {"name": "sn$ebnf$1", "symbols": []},
    {"name": "sn$ebnf$1", "symbols": ["sn$ebnf$1", /["\n"]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "sn", "symbols": ["sn$ebnf$1"]},
    {"name": "sep$string$1", "symbols": [{"literal":"i"}, {"literal":"n"}], "postprocess": (d) => d.join('')},
    {"name": "sep", "symbols": ["__", "sep$string$1", "__"]},
    {"name": "sep", "symbols": ["_", {"literal":";"}, "_"]},
    {"name": "parens", "symbols": [{"literal":"("}, "file", {"literal":")"}], "postprocess": nth(1)},
    {"name": "tuple", "symbols": ["exp3", "_", {"literal":","}, "_", "exp3"], "postprocess": d => ({type: "tuple", items: [d[0], d[4]]})},
    {"name": "tuple", "symbols": ["exp3", "_", {"literal":","}, "_", "tuple"], "postprocess": d => ({type: "tuple", items: [d[0], ...d[4].items]})},
    {"name": "lambda$string$1", "symbols": [{"literal":"-"}, {"literal":">"}], "postprocess": (d) => d.join('')},
    {"name": "lambda", "symbols": [{"literal":"\\"}, "ident", "_", "lambda$string$1", "_", "exp"], "postprocess": d => ({type: "lambda", variable: d[1], value: d[5]})},
    {"name": "app", "symbols": ["exp4", "__", "exp5"], "postprocess": d => ({type: "app", fn: d[0], param: d[2]})},
    {"name": "ident$ebnf$1", "symbols": []},
    {"name": "ident$ebnf$1", "symbols": ["ident$ebnf$1", /[a-zA-Z0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "ident", "symbols": [/[a-zA-Z]/, "ident$ebnf$1"], "postprocess": d => d[0] + merge(d[1])},
    {"name": "value", "symbols": ["string"], "postprocess": d => ({type: "string", value: d[0]})},
    {"name": "value", "symbols": ["number"], "postprocess": d => ({type: "number", value: parseFloat(d[0])})},
    {"name": "string$string$1", "symbols": [{"literal":"\""}, {"literal":"\""}], "postprocess": (d) => d.join('')},
    {"name": "string", "symbols": ["string$string$1"], "postprocess": () => ""},
    {"name": "string", "symbols": [{"literal":"\""}, "chars", {"literal":"\""}], "postprocess": nth(1)},
    {"name": "chars", "symbols": ["char"], "postprocess": d => ({ value: d[0]})},
    {"name": "chars", "symbols": ["char", "chars"], "postprocess": d => ({ value: d[0], next: d[1]})},
    {"name": "char", "symbols": [/[^"\\\x00-\x1F\x7F]/], "postprocess": id},
    {"name": "char$string$1", "symbols": [{"literal":"\\"}, {"literal":"\""}], "postprocess": (d) => d.join('')},
    {"name": "char", "symbols": ["char$string$1"], "postprocess": () => "\""},
    {"name": "char$string$2", "symbols": [{"literal":"\\"}, {"literal":"\\"}], "postprocess": (d) => d.join('')},
    {"name": "char", "symbols": ["char$string$2"], "postprocess": () => "\\"},
    {"name": "char$string$3", "symbols": [{"literal":"\\"}, {"literal":"/"}], "postprocess": (d) => d.join('')},
    {"name": "char", "symbols": ["char$string$3"], "postprocess": () => "/"},
    {"name": "char$string$4", "symbols": [{"literal":"\\"}, {"literal":"b"}], "postprocess": (d) => d.join('')},
    {"name": "char", "symbols": ["char$string$4"], "postprocess": () => "\b"},
    {"name": "char$string$5", "symbols": [{"literal":"\\"}, {"literal":"f"}], "postprocess": (d) => d.join('')},
    {"name": "char", "symbols": ["char$string$5"], "postprocess": () => "\f"},
    {"name": "char$string$6", "symbols": [{"literal":"\\"}, {"literal":"n"}], "postprocess": (d) => d.join('')},
    {"name": "char", "symbols": ["char$string$6"], "postprocess": () => "\n"},
    {"name": "char$string$7", "symbols": [{"literal":"\\"}, {"literal":"r"}], "postprocess": (d) => d.join('')},
    {"name": "char", "symbols": ["char$string$7"], "postprocess": () => "\r"},
    {"name": "char$string$8", "symbols": [{"literal":"\\"}, {"literal":"t"}], "postprocess": (d) => d.join('')},
    {"name": "char", "symbols": ["char$string$8"], "postprocess": () => "\t"},
    {"name": "char$string$9", "symbols": [{"literal":"\\"}, {"literal":"u"}], "postprocess": (d) => d.join('')},
    {"name": "char", "symbols": ["char$string$9", /[0-9a-fA-F]/, /[0-9a-fA-F]/, /[0-9a-fA-F]/, /[0-9a-fA-F]/], "postprocess": d => String.fromCharCode(d[1] + d[2] + d[3] + d[4])},
    {"name": "number", "symbols": ["int"], "postprocess": id},
    {"name": "int", "symbols": ["digit"], "postprocess": id},
    {"name": "int", "symbols": ["digit19", "digits"], "postprocess": merge},
    {"name": "int", "symbols": [{"literal":"-"}, "digit"], "postprocess": merge},
    {"name": "int", "symbols": [{"literal":"-"}, "digit19", "digits"], "postprocess": merge},
    {"name": "digits", "symbols": ["digit"], "postprocess": id},
    {"name": "digits", "symbols": ["digit", "digits"], "postprocess": merge},
    {"name": "digit", "symbols": [/[0-9]/], "postprocess": id},
    {"name": "digit19", "symbols": [/[1-9]/], "postprocess": id}
];

export var ParserStart: string = "file";
