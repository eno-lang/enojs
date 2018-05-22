const errors = require('../errors/validation.js');

class EnoEmpty {
  constructor(context, instruction, parent) {
    this.context = context;
    this.name = instruction.name;
    this.parent = parent;
    this.touched = false;

    instruction.element = this;
  }

  get [Symbol.toStringTag]() {
    return 'EnoEmpty';
  }

  getError(message) {
    return errors.fabricateValueError(
      this.context,
      message,
      this.instruction
    );
  }

  get() {
    this.touched = true;
    return null;
  }

  raw() {
    return { [this.name]: null };
  }

  toString() {
    return `[Object EnoEmpty name="${this.name}"]`;
  }

  touch() {
    this.touched = true;
  }
}

module.exports = EnoEmpty;
