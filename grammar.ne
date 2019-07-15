@{%
    const merge = d => d.join('');
    const nth = n => d => d[n];
%}

@builtin "whitespace.ne"

file -> _ exp _                        {% nth(1) %}

exp -> value                           {% nth(0) %}
     | ident                           {% d => ({type: "ident", name: d[0]}) %}
     | lambda                          {% nth(0) %}
     | app                             {% nth(0) %}
     | parens                          {% nth(0) %}
     | let                             {% nth(0) %}

let -> "let" __ ident _ "=" _ exp __ "in" __ exp       {% d => ({type: "let", ident: d[2], value: d[6], in: d[10]}) %}
     | "let" __ ident _ "=" _ exp __ let               {% d => ({type: "let", ident: d[2], value: d[6], in: d[8]}) %}

parens -> "(" exp ")"                  {% nth(1) %}

lambda -> "\\" ident _ "->" _ exp      {% d => ({type: "lambda", variable: d[1], value: d[5]}) %}

app -> exp __ exp                      {% d => ({type: "app", fn: d[0], param: d[2]}) %}

ident -> [a-z,A-Z] [a-z,A-Z,0-9]:*     {% d => d[0] + merge(d[1]) %}

value -> string                        {% d => ({type: "string", value: d[0]}) %}
       | number                        {% d => ({type: "number", value: parseFloat(d[0])}) %}
       | "true"                        {% d => ({type: "boolean", value: true}) %}
       | "false"                       {% d => ({type: "boolean", value: false}) %}

string -> "\"\""                       {% () => "" %}
        | "\"" chars "\""              {% nth(1) %}

chars -> char                          {% id %}
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