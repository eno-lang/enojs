const errors = require('../errors/validation.js');
const EnoDictionary = require('./dictionary.js');
const EnoEmpty = require('./empty.js');
const EnoList = require('./list.js');
const EnoValue = require('./value.js');

// TODO: Consider a change from 'withTrace' and 'trace' API wording to 'withElement' and 'element' wording,
//       in the big picture this is more reduced, understandable and accurate
// TODO: Investigate and possibly follow .explain() public audience (translated) debug output track :)

class EnoSection {
  constructor(context, instruction, parent) {
    this.context = context;
    this.depth = instruction.depth;
    this.instruction = instruction;
    this.name = instruction.name;
    this.parent = parent;

    this.elementsAssociative = {};
    this.elementsSequential = [];
    this.enforcePresenceDefault = false;
    this.touched = false;

    instruction.element = this;

    const append = element => {
      this.elementsSequential.push(element);

      if(this.elementsAssociative.hasOwnProperty(element.name)) {
        this.elementsAssociative[element.name].push(element);
      } else {
        this.elementsAssociative[element.name] = [element];
      }
    };

    for(let subinstruction of instruction.subinstructions) {
      if(subinstruction.type === 'COMMENT' || subinstruction.type === 'EMPTY_LINE') {
        subinstruction.element = this;
        continue;
      }

      if(subinstruction.type === 'NAME') {
        append(new EnoEmpty(context, subinstruction, this));
        continue;
      }

      if(subinstruction.type === 'FIELD') {
        append(new EnoValue(context, subinstruction, this));
        continue;
      }

      if(subinstruction.type === 'LIST') {
        append(new EnoList(context, subinstruction, this));
        continue;
      }

      if(subinstruction.type === 'BLOCK') {
        append(new EnoValue(context, subinstruction, this));
        continue;
      }

      if(subinstruction.type === 'DICTIONARY') {
        append(new EnoDictionary(context, subinstruction, this));
        continue;
      }

      if(subinstruction.type === 'SECTION') {
        append(new EnoSection(context, subinstruction, this));
        continue;
      }
    }
  }

  get [Symbol.toStringTag]() {
    return 'EnoSection';
  }

  // TODO: Configurable/overridable error message here
  // assertAllTouched(...optional) => assertAllTouched([[message,] options])
  assertAllTouched(options = {}) {
    let names;

    if(options.only) {
      names = options.only;
    } else {
      names = Object.keys(this.elementsAssociative);

      if(options.except) {
        names = names.filter(name => !options.except.includes(name));
      }
    }

    for(let name of names) {
      if(!this.elementsAssociative.hasOwnProperty(name))
        continue;

      for(let element of this.elementsAssociative[name]) {
        if(!element.touched) {
          errors.excessName(this.context, element.instruction);
        }

        if(element instanceof EnoDictionary || element instanceof EnoSection) {
          element.assertAllTouched();
        }
      }
    }
  }

  dictionary(name, ...optional) {
    let options = {
      enforcePresence: this.enforcePresenceDefault,
      required: true
    };

    // TODO: Consider enforcePresence vs. required for the different types,
    //       e.g. what does it mean for dictionary? section? field? spicy details.
    // TODO: Also consider a wording of enforceElement to make it more clear what this is about (the element only exists on a document level, which is what is meant)

    for(let argument of optional) {
      if(typeof argument === 'object') {
        Object.assign(options, argument);
      }
    }

    if(!this.elementsAssociative.hasOwnProperty(name)) {
      if(options.required || options.enforcePresence) {
        errors.missingDictionary(this.context, name, this.instruction);
      }

      return null;
    }

    const elements = this.elementsAssociative[name];

    for(let element of elements) {
      element.touch();

      if(element instanceof EnoList) {
        errors.expectedDictionaryGotList(this.context, element.instruction);
      }

      if(element instanceof EnoSection) {
        errors.expectedDictionaryGotSection(this.context, element.instruction);
      }

      if(element instanceof EnoValue) {
        errors.expectedDictionaryGotField(this.context, element.instruction);
      }
    }

    if(elements.length === 1) {
      const element = elements[0];

      if(element instanceof EnoEmpty) {
        // TODO: Construct EnoDictionary from EnoEmpty, or make the empty behave like a map, and return it
        return null;
      }

      return element;
    }

    if(elements.length > 1) {
      errors.expectedDictionaryGotDictionaries(
        this.context,
        name,
        elements.map(element => element.instruction)
      );
    }
  }

  // TODO: This not used yet, needs usecase/specification
  // mixed(name) {
  //
  // }

  enforcePresence(enforce) {
    this.enforcePresenceDefault = enforce === undefined ? true : enforce;

    for(let element of this.elementsSequential) {
      if(element instanceof EnoDictionary ||
         element instanceof EnoSection) {
        element.enforcePresence(enforce);
      }
    }
  }

  field(name, ...optional) {
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

    if(!this.elementsAssociative.hasOwnProperty(name)) {
      if(options.required || options.enforcePresence) {
        errors.missingField(this.context, name, this.instruction);
      }

      // TODO: A trace to a missing name is not really sensible i guess, consider how to deal with this
      if(options.withTrace) {
        return { trace: null, value: null };
      } else {
        return null;
      }
    }

    const elements = this.elementsAssociative[name];

    for(let element of elements) {
      element.touch();

      if(element instanceof EnoDictionary) {
        errors.expectedFieldGotDictionary(this.context, element.instruction);
      }

      if(element instanceof EnoList) {
        errors.expectedFieldGotList(this.context, element.instruction);

      }

      if(element instanceof EnoSection) {
        errors.expectedFieldGotSection(this.context, element.instruction);
      }
    }

    if(elements.length === 1) {
      const element = elements[0];

      if(element instanceof EnoEmpty || element.isEmpty()) {
        if(options.required) {
          errors.missingField(this.context, name, this.instruction);
        }

        // TODO: A trace to a missing name is not really sensible i guess, consider how to deal with this
        //       => We could put the trace on the parent element !?
        if(options.withTrace) {
          return { trace: null, value: null };
        } else {
          return null;
        }
      }

      // TODO: Resolve ambiguity between value and value.value ? valueNode vs value ? node vs value ? pairs ? assignments ? association ?

      if(options.withTrace) {
        return { trace: element, value: element.value(loader) };
      } else {
        return element.value(loader);
      }
    }

    if(elements.length > 1) {
      errors.expectedFieldGotFields(
        this.context,
        name,
        elements.map(element => element.instruction)
      );
    }
  }

  explain(indentation = '') {
    const results = [];

    if(this.name === '<>#:=|\\_ENO_DOCUMENT') {
      results.push(`${indentation}${this.context.messages.inspection.document}`);
    } else {
      results.push(`${indentation}${'#'.repeat(this.depth)} ${this.name}`);
    }

    indentation += '  ';

    for(let element of this.elementsSequential) {
      if(element instanceof EnoEmpty) {
        results.push(`${indentation}${this.context.messages.inspection.empty} ${element.name}`);
        continue;
      }

      if(element instanceof EnoValue) {
        results.push(`${indentation}${element.name}: ${element.value}`);
        continue;
      }

      if(element instanceof EnoList) {
        results.push(element.inspect(indentation));
        continue;
      }

      if(element instanceof EnoDictionary) {
        results.push(element.inspect(indentation));
        continue;
      }

      if(element instanceof EnoSection) {
        results.push(element.inspect(indentation));
        continue;
      }
    }

    return results.join('\n');
  }

  list(name, ...optional) {
    let options = {
      enforcePresence: this.enforcePresenceDefault,
      exactCount: null,
      includeEmpty: false,
      maxCount: null,
      minCount: null,
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

    if(!this.elementsAssociative.hasOwnProperty(name)) {
      if(options.enforcePresence) {
        errors.missingList(this.context, name, this.instruction);
      }

      return [];
    }

    const elements = this.elementsAssociative[name];
    const results = [];

    for(let element of elements) {
      element.touch();

      if(element instanceof EnoList ||
         element instanceof EnoValue) {

        const valueElements = element instanceof EnoList ? element._items : // TODO: Avoid accessing the internals here
                                                                 [element];

        for(let valueElement of valueElements) {
          if(options.includeEmpty || !valueElement.isEmpty()) {
            if(options.withTrace) {
              results.push({ trace: valueElement, value: valueElement.value(loader) });
            } else {
              results.push(valueElement.value(loader));
            }
          }
        }
      }

      if(element instanceof EnoDictionary) {
        errors.expectedListGotDictionary(this.context, element.instruction);
      }

      if(element instanceof EnoSection) {
        errors.expectedListGotSection(this.context, element.instruction);
      }
    }

    if(options.exactCount !== null && results.length !== options.exactCount) {
      errors.exactCountNotMet(this.context,
                              name,
                              results.map(value => value.instruction),
                              options.exactCount,
                              this);
    }

    if(options.minCount !== null && results.length < options.minCount) {
      errors.minCountNotMet(this.context,
                            name,
                            results.map(value => value.instruction),
                            options.minCount,
                            this);
    }

    if(options.maxCount !== null && results.length > options.maxCount) {
      errors.maxCountNotMet(this.context,
                            name,
                            results.map(value => value.instruction),
                            options.minCount,
                            this);
    }

    return results;
  }

  lookup(...position) {
    let line, column;

    if(position.length === 1) {
      line = 1;
      column = 0;
      for(let index = 0; index <= position[0]; index++) {
        if(index > 0 && this.context.input.charAt(index - 1) === '\n') {
          line++;
          column = 0;
        } else {
          column++;
        }
      }
    } else {
      line = position[0];
      column = position [1];
    }

    const instruction = this.context.instructions.find(instruction => {
      return instruction.lineNumber === line;
    });

    if(instruction) {
      const result = {
        element: instruction.element,
        zone: 'element'
      };

      if(instruction.ranges) {
        for(let [type, range] of Object.entries(instruction.ranges)) {
          if(column >= range[0] && column <= range[1]) {
            result.zone = type;
            break;
          }
        }
      }

      return result;
    }

    return null;
  }

  raw() {
    const elements = this.elementsSequential.map(element => element.raw());

    if(this.name === '<>#:=|\\_ENO_DOCUMENT') {
      return elements;
    } else {
      return { [this.name]: elements };
    }
  }

  section(name, ...optional) {
    let options = {
      enforcePresence: this.enforcePresenceDefault,
      required: true
    };

    for(let argument of optional) {
      if(typeof argument === 'object') {
        Object.assign(options, argument);
      }
    }


    if(!this.elementsAssociative.hasOwnProperty(name)) {
      if(options.required || options.enforcePresence) {
        errors.missingSection(this.context, name, this.instruction);
      }

      return null;
    }

    const elements = this.elementsAssociative[name];

    // TODO: For each value store the representational type as well ? (e.g. string may come from "- foo" or -- foo\nxxx\n-- foo) and use that for precise error messages?

    for(let element of elements) {
      element.touch();

      if(element instanceof EnoDictionary) {
        errors.expectedSectionGotDictionary(this.context, element.instruction);
      }

      if(element instanceof EnoEmpty) {
        errors.expectedSectionGotEmpty(this.context, element.instruction);
      }

      if(element instanceof EnoList) {
        errors.expectedSectionGotList(this.context, element.instruction);
      }

      if(element instanceof EnoValue) {
        errors.expectedSectionGotField(this.context, element.instruction);
      }
    }

    if(elements.length === 1) {
      return elements[0];
    }

    errors.expectedSectionGotSections(this.context, name, elements.map(element => element.instruction));
  }

  sections(name) {
    if(!this.elementsAssociative.hasOwnProperty(name)) {
      return [];
    }

    const elements = this.elementsAssociative[name];

    for(let element of elements) {
      element.touch();

      if(element instanceof EnoDictionary) {
        errors.expectedSectionsGotDictionary(this.context, element.instruction);
      }

      if(element instanceof EnoEmpty) {
        errors.expectedSectionsGotEmpty(this.context, element.instruction);

      }

      if(element instanceof EnoList) {
        errors.expectedSectionsGotList(this.context, element.instruction);
      }

      if(element instanceof EnoValue) {
        errors.expectedSectionsGotField(this.context, element.instruction);
      }
    }

    return elements;
  }

  sequential() {
    return this.elementsSequential;
  }

  toString() {
    if(this.name === '<>#:=|\\_ENO_DOCUMENT') {
      return `[Object EnoDocument length="${this.elementsSequential.length}"]`;
    } else {
      return `[Object EnoSection name="${this.name}" length="${this.elementsSequential.length}"]`;
    }
  }

  touch() {
    this.touched = true;
  }
}

module.exports = EnoSection;
