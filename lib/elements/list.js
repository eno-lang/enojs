const EnoValue = require('./value.js');

class EnoList {
  constructor(context, instruction, parent) {
    this.context = context;
    this.instruction = instruction;
    this.name = instruction.name;
    this.parent = parent;
    this.touched = false;
    this._items = [];

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

  explain(indentation = '') {
    const results = [`${indentation}${this.name}`];

    indentation += '  ';

    for(let item of this._items) {
      results.push(`${indentation}${item.value}`);
    }

    return results.join('\n');
  }

  items(...optional) {
    let loader = null;

    for(let argument of optional) {
      if(typeof argument === 'function') {
        loader = argument;
      }
    }

    this.touch();

    return this._items.map(item => item.value(loader));
  }

  raw() {
    return { [this.name]: this._items.map(item => item.value()) };
  }

  toString() {
    return `[Object EnoList name="${this.name}" length="${this._items.length}"]`;
  }

  touch() {
    this.touched = true;

    for(let item of this._items) {
      item.touch();
    }
  }
}

module.exports = EnoList;
