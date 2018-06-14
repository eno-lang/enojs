const errors = require('../errors/validation.js');

class EnoValue {
  constructor(context, instruction, parent, fromEmpty = false) {
    this.context = context;
    this.instruction = instruction;
    this.name = instruction.name;
    this.parent = parent;
    this._value = instruction.value || null;
    this.touched = false;

    if(fromEmpty) return;

    instruction.element = this;

    if(instruction.subinstructions) {
      let unresolved_newlines;

      for(let subinstruction of instruction.subinstructions) {
        subinstruction.element = this;

        if(subinstruction.type === 'FIELD_APPEND') {
          if(this._value === null) {
            this._value = subinstruction.value;
            unresolved_newlines = 0;
          } else {
            if(subinstruction.value === null) {
              if(subinstruction.separator === '\n') {
                unresolved_newlines++;
              }
            } else {
              if(unresolved_newlines > 0) {
                this._value += '\n'.repeat(unresolved_newlines)
                unresolved_newlines = 0;
              }

              this._value += subinstruction.separator + subinstruction.value;
            }
          }
          continue;
        }

        if(subinstruction.type === 'BLOCK_CONTENT') {
          if(this._value === null) {
            this._value = subinstruction.line;
            unresolved_newlines = 0;
          } else {
            if(unresolved_newlines > 0) {
              this._value += '\n'.repeat(unresolved_newlines)
              unresolved_newlines = 0;
            }

            this._value += '\n' + subinstruction.line;
          }
          continue;
        }
      }
    }
  }

  get [Symbol.toStringTag]() {
    return 'EnoValue';
  }

  explain(indentation = '') {
    return `${indentation}${this.context.messages.inspection.value} ${this._value} (${this.name})`;
  }

  error(message) {
    if(typeof message === 'function') {
      message = message({ name: this.name, value: this._value });
    }

    return errors.valueError(this.context, message, this.instruction);
  }

  isEmpty() {
    return this._value === null;
  }

  raw() {
    if(this.name) {
      return { [this.name]: this._value };
    } else {
      return this._value;
    }
  }

  toString() {
    let value = this._value;

    if(value === null) {
      value = 'null';
    } else {
      value = value.replace('\n', '\\n');
      if(value.length > 14) {
        value = value.substr(0, 11) + '...';
      }
      value = `"${value}"`;
    }

    if(this.name) {
      return `[object EnoValue name="${this.name}" value=${value}]`;
    } else {
      return `[object EnoValue value=${value}]`;
    }
  }

  touch() {
    this.touched = true;
  }

  value(loader, options = { enforceValue: false }) {
    this.touched = true;

    if(options.required !== undefined) {
      options.enforceValue = options.required;
    }

    if(this._value !== null) {
      if(loader) {
        try {
          return loader({ name: this.name, value: this._value });
        } catch(message) {
          throw errors.valueError(this.context, message, this.instruction);
        }
      }

      return this._value;
    } else {
      if(options.enforceValue) {
        // TODO: Here we need a "missing value" type message in the message catalog
        throw errors.valueError(this.context, 'missing value', this.instruction);
      }

      return null;
    }
  }
}

module.exports = EnoValue;
