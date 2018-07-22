const Field = require('./field.js');
const loaders = require('../loaders.js');

class List {
  constructor(context, instruction, parent, fromEmpty = false) {
    this.context = context;
    this.instruction = instruction;
    this.name = instruction.name;
    this.parent = parent;
    this.touched = false;
    this._items = [];

    if(fromEmpty) return;

    instruction.element = this;

    for(let subinstruction of instruction.subinstructions) {
      if(subinstruction.type === 'LIST_ITEM') {
        subinstruction.element = new Field(context, subinstruction, this);
        this._items.push(subinstruction.element);
      } else {
        subinstruction.element = this;
      }
    }
  }

  get [Symbol.toStringTag]() {
    return 'List';
  }

  elements() {
    this.touched = true;
    return this._items;
  }

  // explain(indentation = '') {
  //   const results = [`${indentation}${this.name}`];
  //
  //   indentation += '  ';
  //
  //   for(let item of this._items) {
  //     results.push(`${indentation}${item.value}`);
  //   }
  //
  //   return results.join('\n');
  // }

  items(...optional) {
    const options = {
      elements: false,
      enforceValues: true,
      withElements: false
    };
    let loader = null;

    for(let argument of optional) {
      if(typeof argument === 'function') {
        loader = argument;
      } else if(typeof argument === 'object') {
        Object.assign(options, argument);
      }
    }

    this.touched = true;

    if(options.elements) {
      return this._items;
    }

    if(options.withElements) {
      return this._items.map(item => ({
        element: item,
        value: item.value(loader, { enforceValue: options.enforceValues })
      }));
    }

    return this._items.map(item =>
      item.value(loader, { enforceValue: options.enforceValues })
    );
  }

  length() {
    return this._items.length;
  }

  raw() {
    return { [this.name]: this._items.map(item => item.value()) };
  }

  toString() {
    return `[object List name="${this.name}" items=${this._items.length}]`;
  }

  touch(items = false) {
    this.touched = true;

    if(items) {
      for(let item of this._items) {
        item.touch();
      }
    }
  }
}

List.prototype.stringItems = List.prototype.items;

for(let [name, func] of Object.entries(loaders)) {
  List.prototype[`${name}Items`] = function(...optional) {
    return this.items(func, ...optional);
  }
}

module.exports = List;
