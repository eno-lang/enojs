# enojs

JavaScript implementation of the eno library specification

## Installation

```
npm install enojs
```

## Getting started

```js
const eno = require('enojs');
const fs = require('fs');

const input = fs.readFileSync('[your-file].eno');

const document = eno.parse(input);

console.log( document.field('[your-field]') );  // prints '[your-value]'
```

The complete library documentation is at https://eno-lang.org/js/
