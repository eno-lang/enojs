const EnoValue = require('./value.js');
const errors = require('../errors/validation.js');

class EnoDictionary {
  constructor(context, instruction, parent, fromEmpty = false) {
    this.context = context;
    this.instruction = instruction;
    this.name = instruction.name;
    this.parent = parent;

    this.entries = {};

    // A dictionary might be lazily constructed if it appears in the document as an empty element,
    // which represents an ambiguous element that might resolve to either a dictionary, field or list.
    // When the application requests such an empty element as a dictionary, it is lazily constructed.
    if(fromEmpty) {
      this.enforcePresenceDefault = parent.enforcePresenceDefault;
      this.touched = true;
    } else {
      instruction.element = this;

      this.touched = false;
      this.enforcePresenceDefault = false;

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
      if(this.entries.hasOwnProperty(name) && !this.entries[name].touched) {
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

    if(!this.entries.hasOwnProperty(name)) {
      if(options.required || options.enforcePresence) {
        errors.missingDictionaryEntry(this.context, name, this.instruction);
      }

      if(options.withTrace) {
        return { trace: null, value: null };
      } else {
        return null;
      }
    }

    const element = this.entries[name];

    element.touch();

    if(element.isEmpty()) {
      if(options.required) {
        errors.missingDictionaryEntry(this.context, name, this.instruction);
      }

      if(options.withTrace) {
        return { trace: null, value: null };
      } else {
        return null;
      }
    }

    if(options.withTrace) {
      return { trace: element, value: element.value(loader) };
    } else {
      return element.value(loader);
    }
  }

  enforcePresence(enforce = true) {
    this.enforcePresenceDefault = enforce;
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
    return `[object EnoDictionary name="${this.name}" length="${Object.keys(this.entries).length}"]`;
  }

  // TODO: Think through how an empty dictionary can be implicitly (?) touched
  //       when it is processed as part of a sequential section
  touch() {
    this.touched = true;
  }
}

module.exports = EnoDictionary;
