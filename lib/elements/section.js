const errors = require('../errors/validation.js');
const EnoDictionary = require('./dictionary.js');
const EnoEmpty = require('./empty.js');
const EnoList = require('./list.js');
const EnoValue = require('./value.js');

// TODO: Investigate and possibly follow .explain() public audience (translated) debug output track :)
// TODO: Resolve ambiguity between value and value.value ? valueNode vs value ? node vs value ? pairs ? assignments ? association ?

class EnoSection {
  constructor(context, instruction, parent) {
    this.context = context;
    this.depth = instruction.depth;
    this.instruction = instruction;
    this.name = instruction.name;
    this.parent = parent;

    this.elementsAssociative = {};
    this.elementsSequential = [];
    this.globallyEnforceElements = false;
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

    for(let [name, elements] of Object.entries(this.elementsAssociative)) {
      if(options.except && options.except.includes(name)) continue;
      if(options.only && !options.only.includes(name)) continue;

      for(let element of elements) {
        if(!element.touched) {
          if(typeof message === 'function') {
            message = message({
              name: element.name,
              value: element instanceof EnoDictionary || element instanceof EnoSection ? undefined : element.value()
            });
          }

          throw errors.excessName(this.context, message, element.instruction);
        }

        if(element instanceof EnoDictionary || element instanceof EnoSection) {
          element.assertAllTouched(message);
        }
      }
    }
  }

  dictionaries(name) {
    this.touched = true;

    if(!this.elementsAssociative.hasOwnProperty(name)) {
      return [];
    }

    const elements = this.elementsAssociative[name];

    return elements.map(element => {
      element.touch();

      if(element instanceof EnoDictionary) {
        return element;
      }

      if(element instanceof EnoEmpty) {
        return new EnoDictionary(this.context, element.instruction, this, true);
      }

      if(element instanceof EnoList) {
        throw errors.expectedDictionariesGotList(this.context, element.instruction);
      }

      if(element instanceof EnoSection) {
        throw errors.expectedDictionariesGotSection(this.context, element.instruction);
      }

      if(element instanceof EnoValue) {
        throw errors.expectedDictionariesGotField(this.context, element.instruction);
      }
    });
  }

  dictionary(name, ...optional) {
    let options = {
      enforceElement: this.globallyEnforceElements,
      required: true
    };

    // TODO: Consider enforceElement vs. required for the different types,
    //       e.g. what does it mean for dictionary? section? field? spicy details.

    for(let argument of optional) {
      if(typeof argument === 'object') {
        Object.assign(options, argument);
      }
    }

    this.touched = true;

    if(!this.elementsAssociative.hasOwnProperty(name)) {
      if(options.required || options.enforceElement) {
        throw errors.missingDictionary(this.context, name, this.instruction);
      }

      return null;
    }

    const elements = this.elementsAssociative[name];

    for(let element of elements) {
      if(element instanceof EnoList) {
        throw errors.expectedDictionaryGotList(this.context, element.instruction);
      }

      if(element instanceof EnoSection) {
        throw errors.expectedDictionaryGotSection(this.context, element.instruction);
      }

      if(element instanceof EnoValue) {
        throw errors.expectedDictionaryGotField(this.context, element.instruction);
      }

      element.touch();
    }

    if(elements.length === 1) {
      const element = elements[0];

      if(element instanceof EnoEmpty) {
        return new EnoDictionary(this.context, element.instruction, this, true);
      }

      return element;
    }

    if(elements.length > 1) {
      throw errors.expectedDictionaryGotDictionaries(
        this.context,
        name,
        elements.map(element => element.instruction)
      );
    }
  }

  element(name, options = { enforceElement: false }) {
    this.touched = true;

    if(!this.elementsAssociative.hasOwnProperty(name)) {
      if(options.enforceElement) {
        throw errors.missingElement(this.context, name, this.instruction);
      }

      return null;
    }

    elements = this.elementsAssociative[name];

    if(elements.length > 1) {
      throw errors.expectedElementGotElements(this.context, name, elements.map(element => element.instruction));
    }

    return elements[0];
  }

  elements() {
    return this.elementsSequential;
  }

  enforceElements(enforce = true) {
    this.globallyEnforceElements = enforce;

    for(let element of this.elementsSequential) {
      if(element instanceof EnoDictionary ||
         element instanceof EnoSection) {
        element.enforceElements(enforce);
      }
    }
  }

  field(name, ...optional) {
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

    if(!this.elementsAssociative.hasOwnProperty(name)) {
      if(options.required || options.enforceElement) {
        throw errors.missingField(this.context, name, this.instruction);
      }

      if(options.withElement) {
        return { element: null, value: null };
      }

      return null;
    }

    const elements = this.elementsAssociative[name];

    for(let element of elements) {
      if(element instanceof EnoDictionary) {
        throw errors.expectedFieldGotDictionary(this.context, element.instruction);
      }

      if(element instanceof EnoList) {
        throw errors.expectedFieldGotList(this.context, element.instruction);

      }

      if(element instanceof EnoSection) {
        throw errors.expectedFieldGotSection(this.context, element.instruction);
      }

      element.touch();
    }

    if(elements.length === 1) {
      const element = elements[0];

      if(element instanceof EnoEmpty || element.isEmpty()) {
        if(options.required) {
          throw errors.missingField(this.context, name, this.instruction);
        }

        // TODO: A trace to a missing name is not really sensible i guess, consider how to deal with this
        //       => We could put the trace on the parent element !?
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

    if(elements.length > 1) {
      throw errors.expectedFieldGotFields(
        this.context,
        name,
        elements.map(element => element.instruction)
      );
    }
  }

  fields(name) {
    this.touched = true;

    if(!this.elementsAssociative.hasOwnProperty(name)) {
      return [];
    }

    const elements = this.elementsAssociative[name];

    return elements.map(element => {
      element.touch();

      if(element instanceof EnoValue) {
        return element;
      }

      if(element instanceof EnoEmpty) {
        return new EnoValue(this.context, element.instruction, this, true);
      }

      if(element instanceof EnoDictionary) {
        throw errors.expectedFieldsGotDictionary(this.context, element.instruction);
      }

      if(element instanceof EnoList) {
        throw errors.expectedFieldsGotList(this.context, element.instruction);
      }

      if(element instanceof EnoSection) {
        throw errors.expectedFieldsGotSection(this.context, element.instruction);
      }
    });
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
      enforceElement: this.globallyEnforceElements,
      exactCount: null,
      maxCount: null,
      minCount: null,
      withElements: false
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

    if(!this.elementsAssociative.hasOwnProperty(name)) {
      if(options.enforceElement ||
         options.exactCount !== null && options.exactCount > 0 ||
         options.minCount !== null && options.minCount > 0) {
        throw errors.missingList(this.context, name, this.instruction);
      }

      return [];
    }

    const elements = this.elementsAssociative[name];

    for(let element of elements) {
      if(element instanceof EnoValue) {
        throw errors.expectedListGotDictionary(this.context, element.instruction);
      }

      if(element instanceof EnoDictionary) {
        throw errors.expectedListGotDictionary(this.context, element.instruction);
      }

      if(element instanceof EnoSection) {
        throw errors.expectedListGotSection(this.context, element.instruction);
      }

      element.touch();
    }

    if(elements.length > 1) {
      throw errors.expectedListGotLists(
        this.context,
        name,
        elements.map(element => element.instruction)
      );
    }

    const element = elements[0];
    const count = element instanceof EnoEmpty ? 0 : element.length();

    if(options.exactCount !== null && count !== options.exactCount) {
      throw errors.exactCountNotMet(this.context, element.instruction, options.exactCount);
    }

    if(options.minCount !== null && count < options.minCount) {
      throw errors.minCountNotMet(this.context, element.instruction, options.minCount);
    }

    if(options.maxCount !== null && count > options.maxCount) {
      throw errors.maxCountNotMet(this.context, element.instruction, options.minCount);
    }

    if(element instanceof EnoEmpty) {
      return [];
    } else {
      return element.items(loader, { withElements: options.withElements });
    }
  }

  lists(name) {
    if(!this.elementsAssociative.hasOwnProperty(name)) {
      return [];
    }

    const elements = this.elementsAssociative[name];

    return elements.map(element => {
      element.touch();

      if(element instanceof EnoList) {
        return element;
      }

      if(element instanceof EnoEmpty) {
        return new EnoList(this.context, element.instruction, this, true);
      }

      if(element instanceof EnoDictionary) {
        throw errors.expectedListsGotDictionary(this.context, element.instruction);
      }

      if(element instanceof EnoSection) {
        throw errors.expectedListsGotSection(this.context, element.instruction);
      }

      if(element instanceof EnoValue) {
        throw errors.expectedListsGotField(this.context, element.instruction);
      }
    });
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
      enforceElement: this.globallyEnforceElements, // TODO: null/undefined as default for globally... and local fallback defaults that are sensibly different for different elements
      required: true                                //       Then get rid of required which is kind of redundant and begin to tackle the required wording for "requiredValue"
    };

    for(let argument of optional) {
      if(typeof argument === 'object') {
        Object.assign(options, argument);
      }
    }

    this.touched = true;

    if(!this.elementsAssociative.hasOwnProperty(name)) {
      if(options.required || options.enforceElement) {
        throw errors.missingSection(this.context, name, this.instruction);
      }

      return null;
    }

    const elements = this.elementsAssociative[name];

    for(let element of elements) {
      if(element instanceof EnoDictionary) {
        throw errors.expectedSectionGotDictionary(this.context, element.instruction);
      }

      if(element instanceof EnoEmpty) {
        throw errors.expectedSectionGotEmpty(this.context, element.instruction);
      }

      if(element instanceof EnoList) {
        throw errors.expectedSectionGotList(this.context, element.instruction);
      }

      if(element instanceof EnoValue) {
        throw errors.expectedSectionGotField(this.context, element.instruction);
      }

      element.touch();
    }

    if(elements.length > 1) {
      throw errors.expectedSectionGotSections(
        this.context,
        name,
        elements.map(element => element.instruction)
      );
    }

    return elements[0];
  }

  sections(name) {
    this.touched = true;

    if(!this.elementsAssociative.hasOwnProperty(name)) {
      return [];
    }

    const elements = this.elementsAssociative[name];

    for(let element of elements) {
      if(element instanceof EnoDictionary) {
        throw errors.expectedSectionsGotDictionary(this.context, element.instruction);
      }

      if(element instanceof EnoEmpty) {
        throw errors.expectedSectionsGotEmpty(this.context, element.instruction);
      }

      if(element instanceof EnoList) {
        throw errors.expectedSectionsGotList(this.context, element.instruction);
      }

      if(element instanceof EnoValue) {
        throw errors.expectedSectionsGotField(this.context, element.instruction);
      }

      element.touch();
    }

    return elements;
  }

  toString() {
    if(this.name === '<>#:=|\\_ENO_DOCUMENT') {
      return `[object EnoSection document elements=${this.elementsSequential.length}]`;
    } else {
      return `[object EnoSection name="${this.name}" elements=${this.elementsSequential.length}]`;
    }
  }

  touch() {
    this.touched = true;
  }
}

module.exports = EnoSection;
