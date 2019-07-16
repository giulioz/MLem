@{%
    const merge = d => d.join('');
    const nth = n => d => d[n];
%}

@builtin "whitespace.ne"

file -> _ exp _                        {% nth(1) %}

exp -> exp2                            {% nth(0) %}
     | let                             {% nth(0) %}
     | type                            {% nth(0) %}

exp2 -> exp3                           {% nth(0) %}
      | tuple                          {% nth(0) %}

exp3 -> exp4                           {% nth(0) %}
      | match                          {% nth(0) %}

exp4 -> exp5                           {% nth(0) %}
      | app                            {% nth(0) %}

exp5 -> value                          {% nth(0) %}
      | ident                          {% d => ({type: "ident", name: d[0]}) %}
      | lambda                         {% nth(0) %}
      | parens                         {% nth(0) %}

type -> "type" __ ident _ "=" _ typeExp sep exp  {% d => ({type: "type", ident: d[2], value: d[6], in: d[8]}) %}

typeExp -> typeExp2                    {% d => d[0] %}
         | typeExp2 _ "|" _ typeExp    {% d => ({...d[0], ...d[4]}) %}

typeExp2 -> ident                      {% d => ({[d[0]]: []}) %}
          | ident __ "of" __ algT      {% d => ({[d[0]]: d[4]}) %}

algT -> ident                          {% d => [d[0]] %}
      | ident _ "*" _ algT             {% d => [d[0], ...d[4]] %}

match -> "match" __ exp5 __ "with" __ (msp | null) matchCases {% d => ({type: "match", value: d[2], cases: d[7]}) %}

matchCases -> matchCase                {% d => [d[0]] %}
            | matchCase msp matchCases {% d => [d[0], ...d[2]] %}
msp -> _ "|" _
matchCase -> exp5 _ "->" _ exp5        {% d => ({case: d[0], value: d[4]}) %}
           | "_" _ "->" _ exp5         {% d => ({value: d[4]}) %}

let -> "let" __ ident _ "=" _ exp4 sep exp       {% d => ({type: "let", ident: d[2], value: d[6], in: d[8]}) %}

sn -> ["\n"]:*
sep -> __ "in" __ | _ ";" _
parens -> "(" exp ")"                  {% nth(1) %}

tuple -> exp3 _ "," _ exp3             {% d => ({type: "tuple", items: [d[0], d[4]]}) %}
       | exp3 _ "," _ tuple            {% d => ({type: "tuple", items: [d[0], ...d[4].items]}) %}

lambda -> "\\" ident _ "->" _ exp      {% d => ({type: "lambda", variable: d[1], value: d[5]}) %}

app -> exp5 __ exp5                    {% d => ({type: "app", fn: d[0], param: d[2]}) %}

ident -> [a-zA-Z] [a-zA-Z0-9]:*        {% d => d[0] + merge(d[1]) %}

value -> string                        {% d => ({type: "string", value: d[0]}) %}
       | number                        {% d => ({type: "number", value: parseFloat(d[0])}) %}

string -> "\"\""                       {% () => "" %}
        | "\"" chars "\""              {% nth(1) %}

chars -> char                          {% d => ({ value: d[0]}) %}
       | char chars                    {% d => ({ value: d[0], next: d[1]}) %}

char -> [^"\\\x00-\x1F\x7F]            {% id %}
      | "\\\""                         {% () => "\"" %}
      | "\\\\"                         {% () => "\\" %}
      | "\\/"                          {% () => "/" %}
      | "\\b"                          {% () => "\b" %}
      | "\\f"                          {% () => "\f" %}
      | "\\n"                          {% () => "\n" %}
      | "\\r"                          {% () => "\r" %}
      | "\\t"                          {% () => "\t" %}
      | "\\u" [0-9a-fA-F] [0-9a-fA-F] [0-9a-fA-F] [0-9a-fA-F]
                                       {% d => String.fromCharCode(d[1] + d[2] + d[3] + d[4]) %}

number -> int                          {% id %}

int -> digit                           {% id %}
     | digit19 digits                  {% merge %}
     | "-" digit                       {% merge %}
     | "-" digit19 digits              {% merge %}

digits -> digit                        {% id %}
        | digit digits                 {% merge %}

digit -> [0-9]                         {% id %}

digit19 -> [1-9]                       {% id %}