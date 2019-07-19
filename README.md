# MLem

### Syntax

Whole program is a big expression, use parentheses to avoid ambiguities.

- `let` binding
```
let name = value in expression
```

- Function apply — functions have only one parameter
```
inc 2
```

- Lambda abstraction
```
\x -> x
```

- Data Types
  - Numeric integer literal
  - Boolean literal, `true` or `false`
  - String literal, between `""`

#### Example program

```
let three = inc 2 in
let ident = (\x -> x) in
(ident (inc three))
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
