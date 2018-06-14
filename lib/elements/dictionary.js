const EnoValue = require('./value.js');
const errors = require('../errors/validation.js');

class EnoDictionary {
  constructor(context, instruction, parent, fromEmpty = false) {
    this.context = context;
    this.instruction = instruction;
    this.name = instruction.name;
    this.parent = parent;

    this.entries = {};

    if(fromEmpty) {
      this.globallyEnforceElements = parent.globallyEnforceElements;
      this.touched = true;
    } else {
      instruction.element = this;

      this.touched = false;
      this.globallyEnforceElements = false;

      for(let subinstruction of instruction.subinstructions) {
        if(subinstruction.type === 'DICTIONARY_ENTRY') {
          subinstruction.element = new EnoValue(context, subinstruction, this);
          this.entries[subinstruction.name] = subinstruction.element;
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

    for(let [name, element] of Object.entries(this.entries)) {
      if(options.except && options.except.includes(name)) continue;
      if(options.only && !options.only.includes(name)) continue;

      if(!element.touched) {
        if(typeof message === 'function') {
          message = message({ name: element.name, value: element.value() });
        }

        throw errors.excessName(this.context, message, element.instruction);
      }
    }
  }

  entry(name, ...optional) {
    let options = {
      enforceElement: this.globallyEnforceElements,
      required: false,
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

    this.touched = true;

    if(!this.entries.hasOwnProperty(name)) {
      if(options.required || options.enforceElement) {
        throw errors.missingDictionaryEntry(this.context, name, this.instruction);
      }

      if(options.withElement) {
        return { element: null, value: null };
      } else {
        return null;
      }
    }

    const element = this.entries[name];

    element.touch();

    if(element.isEmpty()) {
      if(options.required) {
        throw errors.missingDictionaryEntry(this.context, name, this.instruction);
      }

      if(options.withElement) {
        return { element: null, value: null };
      } else {
        return null;
      }
    }

    if(options.withElement) {
      return { element: element, value: element.value(loader) };
    } else {
      return element.value(loader);
    }
  }

  enforceElements(enforce = true) {
    this.globallyEnforceElements = enforce;
  }

  explain(indentation = '') {
    const results = [`${indentation}${this.name}`];

    indentation += '  ';

    for(let [name, entry] of Object.entries(this.entries)) {
      results.push(`${indentation}${name} = ${entry.value()}`);
    }

    return results.join('\n');
  }

  raw() {
    const entries = {};

    for(let [name, entry] of Object.entries(this.entries)) {
      entries[name] = entry.value();
    }

    return { [this.name]: entries };
  }

  toString() {
    return `[object EnoDictionary name="${this.name}" entries=${Object.keys(this.entries).length}]`;
  }

  // TODO: Think through how an empty dictionary can be implicitly (?) touched
  //       when it is processed as part of a sequential section
  touch(entries = false) {
    this.touched = true;

    if(entries) {
      for(let entry of this._entries) {
        entry.touch();
      }
    }
  }
}

module.exports = EnoDictionary;
