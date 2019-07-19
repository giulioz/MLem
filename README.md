# MLem

**Meta Language Extensions and Manipulation**

![logo](logo.png)

### Syntax

Whole program is a big expression, use parentheses to avoid ambiguities.

- `let` binding
```
let name = value; expression
```

- Function apply — functions have only one parameter
```
inc 2
```

- Lambda abstraction
```
\x -> x
```

- Pattern matching
```
match exp with
| case -> value
| _ -> fallback
```

- Data Types
  - Numeric integer literal `number`
  - Tuples `(a,b,...)`
  - String literal, between `""`

- Custom Types:
```
type Boolean = true | false;
type MaybeTwo = Just number * number | Nothing;
```

Use Y Combinator for recursion (native recursion not yet supported).

#### Example program

```
let three = inc 2 in
let ident = (\x -> x) in
(ident (inc three))

type Boolean = true | false;
let Y = \f -> ((\x -> (x x)) (\y -> (f (\x -> ((y y) x)))));
let sub = \x -> \y -> (sum x (neg y));

let fibonacci = Y (\f -> \x -> 
  match x with
  | 0 -> 0
  | 1 -> 1
  | x -> (
    let a = (sub x) 1;
    let b = (sub x) 2;
    let fa = f a;
    let fb = f b;
    sum fa fb
  )
);

match (fibonacci 8) with
| 21 -> true
| _ -> false
```

### Usage

Place your code in `test.mml`.

```
yarn install
yarn start
```

#### Rebuild grammar

```
yarn build
```
