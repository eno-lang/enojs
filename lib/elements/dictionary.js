const EnoValue = require('./value.js');
const errors = require('../errors/validation.js');
const loaders = require('../loaders.js');

class EnoDictionary {
  constructor(context, instruction, parent, fromEmpty = false) {
    this.context = context;
    this.instruction = instruction;
    this.name = instruction.name;
    this.parent = parent;

    this._entries = [];
    this.entries_associative = {};

    if(fromEmpty) {
      this._enforceAllElements = parent._enforceAllElements;
      this.touched = true;
    } else {
      instruction.element = this;

      this.touched = false;
      this._enforceAllElements = false;

      for(let subinstruction of instruction.subinstructions) {
        if(subinstruction.type === 'DICTIONARY_ENTRY') {
          subinstruction.element = new EnoValue(context, subinstruction, this);
          this._entries.push(subinstruction.element);
          this.entries_associative[subinstruction.name] = subinstruction.element;
        } else {
          subinstruction.element = this;
        }
      }
    }
  }

  get [Symbol.toStringTag]() {
    return 'EnoDictionary';
  }

  assertAllTouched(...optional) {
    let message;
    let options = {
      except: null,
      only: null
    };

    for(let argument of optional) {
      if(typeof argument === 'object') {
        Object.assign(options, argument);
      } else {
        message = argument
      }
    }

    for(let entry of this._entries) {
      if(options.except && options.except.includes(entry.name)) continue;
      if(options.only && !options.only.includes(entry.name)) continue;

      if(!entry.touched) {
        if(typeof message === 'function') {
          message = message({ name: entry.name, value: entry.value() });
        }

        throw errors.excessName(this.context, message, entry.instruction);
      }
    }
  }

  element(name, options = { enforceElement: true }) {
    this.touched = true;

    if(options.required !== undefined) {
      options.enforceElement = options.required;
    }

    if(!this.entries_associative.hasOwnProperty(name)) {
      if(options.enforceElement) {
        throw errors.missingDictionaryEntry(this.context, name, this.instruction);
      }

      return null;
    }

    return this.entries_associative[name];
  }

  elements() {
    this.touched = true;
    return this._entries;
  }

  enforceAllElements(enforce = true) {
    this._enforceAllElements = enforce;
  }

  entries() {
    return this.elements();
  }

  entry(name, ...optional) {
    let options = {
      element: false,
      enforceElement: this._enforceAllElements,
      enforceValue: false,
      required: undefined,
      withElement: false
    };
    let loader = null;

    for(let argument of optional) {
      if(typeof argument === 'function') {
        loader = argument;
      } else if(typeof argument === 'object') {
        Object.assign(options, argument);
      }
    }

    if(options.required !== undefined) {
      options.enforceValue = options.required;
    }
    options.enforceElement = options.enforceElement || options.enforceValue;

    this.touched = true;

    if(!this.entries_associative.hasOwnProperty(name)) {
      if(options.enforceElement) {
        throw errors.missingDictionaryEntry(this.context, name, this.instruction);
      }

      if(options.withElement) {
        return { element: null, value: null };
      }

      return null;
    }

    const element = this.entries_associative[name];

    element.touch();

    if(options.element) {
      return element;
    }

    if(options.withElement) {
      return {
        element: element,
        value: element.value(loader, { enforceValue: options.enforceValue })
      };
    }

    return element.value(loader, { enforceValue: options.enforceValue });
  }

  // explain(indentation = '') {
  //   const results = [`${indentation}${this.name}`];
  //
  //   indentation += '  ';
  //
  //   for(let [name, entry] of Object.entries(this.entries)) {
  //     results.push(`${indentation}${name} = ${entry.value()}`);
  //   }
  //
  //   return results.join('\n');
  // }

  raw() {
    return {
      [this.name]: this._entries.map(entry => ({ [entry.name]: entry.value() }))
    };
  }

  toString() {
    return `[object EnoDictionary name="${this.name}" entries=${this._entries.length}]`;
  }

  touch(entries = false) {
    this.touched = true;

    if(entries) {
      for(let entry of this._entries) {
        entry.touch();
      }
    }
  }
}

for(let [name, func] of Object.entries(loaders)) {
  EnoDictionary.prototype[name] = function(name, ...optional) {
    return this.entry(name, func, ...optional);
  }
}

module.exports = EnoDictionary;
