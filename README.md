# enojs

JavaScript library for parsing, loading and inspecting eno documents

## End of life notice

The eno notation language is en route to its final version and **enojs will reach end of life by 2020.**   
enojs is superseded by the [enolib](https://www.npmjs.com/package/enolib) (core library) and [enotype](https://www.npmjs.com/package/enotype) (type library) packages.

Please visit https://eno-lang.org to read up on all changes.

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
