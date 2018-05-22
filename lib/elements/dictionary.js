const EnoValue = require('./value.js');
const errors = require('../errors/validation.js');

class EnoDictionary {
  constructor(context, instruction, parent) {
    this.context = context;
    this.instruction = instruction;
    this.name = instruction.name;
    this.parent = parent;

    this.entries = {};
    this.enforcePresenceDefault = false;
    this.touched = false;

    instruction.element = this;

    for(let subinstruction of instruction.subinstructions) {
      if(subinstruction.type === 'DICTIONARY_ENTRY') {
        subinstruction.element = new EnoValue(context, subinstruction, this);
        this.entries[subinstruction.name] = subinstruction.element;
      } else {
        subinstruction.element = this;
      }
    }
  }

  get [Symbol.toStringTag]() {
    return 'EnoDictionary';
  }

  assertAllTouched(options = {}) {
    let names;

    if(options.only) {
      names = options.only;
    } else {
      names = Object.keys(this.entries);

      if(options.except) {
        names = names.filter(name => !options.except.includes(name));
      }
    }

    for(let name of names) {
      const element = this.entries[name];

      if(element !== undefined && !element.touched) {
        errors.excessName(this.context, element.instruction);
      }
    }
  }

  entry(name, ...optional) {
    let options = {
      enforcePresence: this.enforcePresenceDefault,
      required: false,
      withTrace: false
    };
    let loader = null;

    for(let argument of optional) {
      if(typeof argument === 'function') {
        loader = argument;
      } else if(typeof argument === 'object') {
        Object.assign(options, argument);
      }
    }

    this.touch();

    const element = this.entries[name];

    if(element === undefined) {
      if(options.required || options.enforcePresence) {
        errors.missingDictionaryEntry(this.context, name, this.instruction);
      }

      if(options.withTrace) {
        return { trace: null, value: null };
      } else {
        return null;
      }
    }

    element.touch();

    if(element.value === null) {
      if(options.required) {
        errors.missingDictionaryEntry(this.context, name, this.instruction);
      }

      if(options.withTrace) {
        return { trace: null, value: null };
      } else {
        return null;
      }
    }

    if(loader) {
      try {
        const processed = loader(element);

        if(options.withTrace) {
          return { trace: element, value: processed };
        } else {
          return processed;
        }
      } catch(message) {
        errors.valueError(this.context, message, element.instruction);
      }
    }

    if(options.withTrace) {
      return { trace: element, value: element.get() };
    } else {
      return element.get();
    }
  }

  enforcePresence(enforce) {
    this.enforcePresenceDefault = enforce === undefined ? true : enforce;
  }

  explain(indentation = '') {
    const results = [`${indentation}${this.name}`];

    indentation += '  ';

    for(let [name, value] of Object.entries(this.entries)) {
      results.push(`${indentation}${name} = ${value.value}`);
    }

    return results.join('\n');
  }

  raw() {
    const entries = {};

    for(let name of Object.keys(this.entries)) {
      entries[name] = this.entries[name].get();
    }

    return { [this.name]: entries };
  }

  toString() {
    return `[Object EnoDictionary name="${this.name}" length="${Object.keys(this.entries).length}"]`;
  }

  // TODO: Think through how an empty dictionary can be implicitly (?) touched
  //       when it is processed as part of a sequential section
  touch() {
    this.touched = true;
  }
}

module.exports = EnoDictionary;
