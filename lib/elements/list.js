const EnoValue = require('./value.js');

class EnoList {
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
        subinstruction.element = new EnoValue(context, subinstruction, this);
        this._items.push(subinstruction.element);
      } else {
        subinstruction.element = this;
      }
    }
  }

  get [Symbol.toStringTag]() {
    return 'EnoList';
  }

  elements() {
    this.touched = true;
    return this._items;
  }

  explain(indentation = '') {
    const results = [`${indentation}${this.name}`];

    indentation += '  ';

    for(let item of this._items) {
      results.push(`${indentation}${item.value}`);
    }

    return results.join('\n');
  }

  items(...optional) {
    const options = { withElements: false };
    let loader = null;

    for(let argument of optional) {
      if(typeof argument === 'function') {
        loader = argument;
      } else if(typeof argument === 'object') {
        Object.assign(options, argument);
      }
    }

    this.touched = true;

    return this._items.map(item => {
      if(options.withElements) {
        return { element: item, value: item.value(loader) };
      } else {
        return item.value(loader);
      }
    });
  }

  length() {
    return this._items.length;
  }

  raw() {
    return { [this.name]: this._items.map(item => item.value()) };
  }

  toString() {
    return `[object EnoList name="${this.name}" items=${this._items.length}]`;
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

module.exports = EnoList;
