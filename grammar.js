// Generated automatically by nearley, version 2.16.0
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

    const merge = d => d.join('');
    const nth = n => d => d[n];
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", "wschar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "__$ebnf$1", "symbols": ["wschar"]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", "wschar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "wschar", "symbols": [/[ \t\n\v\f]/], "postprocess": id},
    {"name": "file", "symbols": ["_", "exp", "_"], "postprocess": nth(1)},
    {"name": "exp", "symbols": ["value"], "postprocess": nth(0)},
    {"name": "exp", "symbols": ["ident"], "postprocess": d => ({type: "ident", name: d[0]})},
    {"name": "exp", "symbols": ["lambda"], "postprocess": nth(0)},
    {"name": "exp", "symbols": ["app"], "postprocess": nth(0)},
    {"name": "exp", "symbols": ["parens"], "postprocess": nth(0)},
    {"name": "exp", "symbols": ["let"], "postprocess": nth(0)},
    {"name": "let$string$1", "symbols": [{"literal":"l"}, {"literal":"e"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "let$string$2", "symbols": [{"literal":"i"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "let", "symbols": ["let$string$1", "__", "ident", "_", {"literal":"="}, "_", "exp", "__", "let$string$2", "__", "exp"], "postprocess": d => ({type: "let", ident: d[2], value: d[6], in: d[10]})},
    {"name": "parens", "symbols": [{"literal":"("}, "exp", {"literal":")"}], "postprocess": nth(1)},
    {"name": "lambda$string$1", "symbols": [{"literal":"-"}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "lambda", "symbols": [{"literal":"\\"}, "ident", "_", "lambda$string$1", "_", "exp"], "postprocess": d => ({type: "lambda", variable: d[1], value: d[5]})},
    {"name": "app", "symbols": ["exp", "__", "exp"], "postprocess": d => ({type: "app", fn: d[0], param: d[2]})},
    {"name": "ident$ebnf$1", "symbols": []},
    {"name": "ident$ebnf$1", "symbols": ["ident$ebnf$1", /[a-z,A-Z,0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ident", "symbols": [/[a-z,A-Z]/, "ident$ebnf$1"], "postprocess": d => d[0] + merge(d[1])},
    {"name": "value", "symbols": ["string"], "postprocess": d => ({type: "string", value: d[0]})},
    {"name": "value", "symbols": ["number"], "postprocess": d => ({type: "number", value: parseFloat(d[0])})},
    {"name": "value$string$1", "symbols": [{"literal":"t"}, {"literal":"r"}, {"literal":"u"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "value", "symbols": ["value$string$1"], "postprocess": d => ({type: "boolean", value: true})},
    {"name": "value$string$2", "symbols": [{"literal":"f"}, {"literal":"a"}, {"literal":"l"}, {"literal":"s"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "value", "symbols": ["value$string$2"], "postprocess": d => ({type: "boolean", value: false})},
    {"name": "string$string$1", "symbols": [{"literal":"\""}, {"literal":"\""}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "string", "symbols": ["string$string$1"], "postprocess": () => ""},
    {"name": "string", "symbols": [{"literal":"\""}, "chars", {"literal":"\""}], "postprocess": nth(1)},
    {"name": "chars", "symbols": ["char"], "postprocess": id},
    {"name": "chars", "symbols": ["char", "chars"], "postprocess": merge},
    {"name": "char", "symbols": [/[^"\\\x00-\x1F\x7F]/], "postprocess": id},
    {"name": "char$string$1", "symbols": [{"literal":"\\"}, {"literal":"\""}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "char", "symbols": ["char$string$1"], "postprocess": () => "\""},
    {"name": "char$string$2", "symbols": [{"literal":"\\"}, {"literal":"\\"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "char", "symbols": ["char$string$2"], "postprocess": () => "\\"},
    {"name": "char$string$3", "symbols": [{"literal":"\\"}, {"literal":"/"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "char", "symbols": ["char$string$3"], "postprocess": () => "/"},
    {"name": "char$string$4", "symbols": [{"literal":"\\"}, {"literal":"b"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "char", "symbols": ["char$string$4"], "postprocess": () => "\b"},
    {"name": "char$string$5", "symbols": [{"literal":"\\"}, {"literal":"f"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "char", "symbols": ["char$string$5"], "postprocess": () => "\f"},
    {"name": "char$string$6", "symbols": [{"literal":"\\"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "char", "symbols": ["char$string$6"], "postprocess": () => "\n"},
    {"name": "char$string$7", "symbols": [{"literal":"\\"}, {"literal":"r"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "char", "symbols": ["char$string$7"], "postprocess": () => "\r"},
    {"name": "char$string$8", "symbols": [{"literal":"\\"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "char", "symbols": ["char$string$8"], "postprocess": () => "\t"},
    {"name": "char$string$9", "symbols": [{"literal":"\\"}, {"literal":"u"}], "postprocess": function joiner(d) {return d.join('');}},
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
]
  , ParserStart: "file"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
