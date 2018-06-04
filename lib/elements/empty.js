const errors = require('../errors/validation.js');

class EnoEmpty {
  constructor(context, instruction, parent) {
    this.context = context;
    this.instruction = instruction;
    this.name = instruction.name;
    this.parent = parent;
    this.touched = false;

    instruction.element = this;
  }

  get [Symbol.toStringTag]() {
    return 'EnoEmpty';
  }

  getError(message) {
    if(typeof message === 'function') {
      message = message({ name: this.name, value: null });
    }

    return errors.valueError(this.context, message, this.instruction, true);
  }

  raw() {
    return { [this.name]: null };
  }

  toString() {
    return `[object EnoEmpty name="${this.name}"]`;
  }

  touch() {
    this.touched = true;
  }

  value() {
    this.touched = true;
    return null;
  }
}

module.exports = EnoEmpty;
