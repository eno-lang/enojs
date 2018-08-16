# enojs

JavaScript implementation of the eno library specification

## Installation

```
npm install enojs
```

## Getting started

Create an eno document, for instance `intro.eno`:

```eno
Greeting: Hello World!
```

A minimal example to read this file with `enojs`:

```js
const eno = require('enojs');
const fs = require('fs');

const input = fs.readFileSync('intro.eno', 'utf-8');

const document = eno.parse(input);

console.log( document.field('Greeting') );  // prints 'Hello World!'
```

## Complete documentation and API reference

See [eno-lang.org/javascript](https://eno-lang.org/javascript/)
