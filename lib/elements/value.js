const errors = require('../errors/validation.js');

// TODO:
// Blocks could be copied just by copying the contentRange from the template block
// to the name/field instruction that should be copied into, this however changes the
// general model of always copying subinstructions for copies, with repercussions for
// how the error builders and reporters visualize the document? Although that is not
// entirely developed for complex copy scenarios anyway ...

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

    if(instruction.type === 'BLOCK' && instruction.hasOwnProperty('contentRange')) {
      this._value = context.input.substring(instruction.contentRange[0], instruction.contentRange[1] + 1);
    } else if(instruction.subinstructions) {
      let unresolved_newlines = 0;

      for(let subinstruction of instruction.subinstructions) {
        subinstruction.element = this;

        if(subinstruction.type === 'CONTINUATION') {
          if(this._value === null) {
            this._value = subinstruction.value;
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
        } else if(subinstruction.type === 'BLOCK' && subinstruction.hasOwnProperty('contentRange')) {
          // blocks can only appear as a subinstruction when they are copied,
          // and as a copy they always appear as the first subinstruction,
          // that is why write to value straight without any checks.
          this._value = context.input.substring(
            subinstruction.contentRange[0],
            subinstruction.contentRange[1] + 1
          );
        }
      }
    }
  }

  get [Symbol.toStringTag]() {
    return 'EnoValue';
  }

  // explain(indentation = '') {
  //   return `${indentation}${this.context.messages.inspection.value} ${this._value} (${this.name})`;
  // }

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

  value(...optional) {
    let loader;
    let options = {
      enforceValue: false,
      required: undefined
    };

    for(let argument of optional) {
      if(typeof argument === 'function') {
        loader = argument;
      } else {
        Object.assign(options, argument);
      }
    }

    if(options.required !== undefined) {
      options.enforceValue = options.required;
    }

    this.touched = true;

    if(this._value !== null) {
      if(loader) {
        try {
          return loader({ context: this.context, name: this.name, value: this._value });
        } catch(message) {
          throw errors.valueError(this.context, message, this.instruction);
        }
      }

      return this._value;
    } else {
      if(options.enforceValue) {
        throw errors.missingValue(this.context, this.instruction);
      }

      return null;
    }
  }
}

module.exports = EnoValue;
