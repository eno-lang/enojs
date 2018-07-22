const errors = require('../errors/validation.js');

class Empty {
  constructor(context, instruction, parent) {
    this.context = context;
    this.instruction = instruction;
    this.name = instruction.name;
    this.parent = parent;
    this.touched = false;

    instruction.element = this;
  }

  get [Symbol.toStringTag]() {
    return 'Empty';
  }

  error(message) {
    if(typeof message === 'function') {
      message = message({ name: this.name, value: null });
    }

    return errors.valueError(this.context, message, this.instruction);
  }

  raw() {
    return { [this.name]: null };
  }

  toString() {
    return `[object Empty name="${this.name}"]`;
  }

  touch() {
    this.touched = true;
  }

  value() {
    this.touched = true;
    return null;
  }
}

module.exports = Empty;
