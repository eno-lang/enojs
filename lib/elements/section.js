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
        throw errors.missingDictionary(this.context, name, this.instruction);
      }

      return null;
    }

    const elements = this.elementsAssociative[name];

    for(let element of elements) {
      element.touch();

      if(element instanceof EnoList) {
        throw errors.expectedDictionaryGotList(this.context, element.instruction);
      }

      if(element instanceof EnoSection) {
        throw errors.expectedDictionaryGotSection(this.context, element.instruction);
      }

      if(element instanceof EnoValue) {
        throw errors.expectedDictionaryGotField(this.context, element.instruction);
      }
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

  // TODO: This not used yet, needs usecase/specification
  // mixed(name) {
  //
  // }

  enforcePresence(enforce = true) {
    this.enforcePresenceDefault = enforce;

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
        throw errors.missingField(this.context, name, this.instruction);
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
        throw errors.expectedFieldGotDictionary(this.context, element.instruction);
      }

      if(element instanceof EnoList) {
        throw errors.expectedFieldGotList(this.context, element.instruction);

      }

      if(element instanceof EnoSection) {
        throw errors.expectedFieldGotSection(this.context, element.instruction);
      }
    }

    if(elements.length === 1) {
      const element = elements[0];

      if(element instanceof EnoEmpty || element.isEmpty()) {
        if(options.required) {
          throw errors.missingField(this.context, name, this.instruction);
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
      throw errors.expectedFieldGotFields(
        this.context,
        name,
        elements.map(element => element.instruction)
      );
    }
  }

  fields(name) {
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

  // TODO: Consider this to really only fetch a list, not multiple fields as well.
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
        throw errors.missingList(this.context, name, this.instruction);
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
        throw errors.expectedListGotDictionary(this.context, element.instruction);
      }

      if(element instanceof EnoSection) {
        throw errors.expectedListGotSection(this.context, element.instruction);
      }
    }

    if(options.exactCount !== null && results.length !== options.exactCount) {
      throw errors.exactCountNotMet(this.context,
                              name,
                              results.map(value => value.instruction),
                              options.exactCount,
                              this);
    }

    if(options.minCount !== null && results.length < options.minCount) {
      throw errors.minCountNotMet(this.context,
                            name,
                            results.map(value => value.instruction),
                            options.minCount,
                            this);
    }

    if(options.maxCount !== null && results.length > options.maxCount) {
      throw errors.maxCountNotMet(this.context,
                            name,
                            results.map(value => value.instruction),
                            options.minCount,
                            this);
    }

    return results;
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
        throw errors.missingSection(this.context, name, this.instruction);
      }

      return null;
    }

    const elements = this.elementsAssociative[name];

    // TODO: For each value store the representational type as well ? (e.g. string may come from "- foo" or -- foo\nxxx\n-- foo) and use that for precise error messages?

    for(let element of elements) {
      element.touch();

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
    }

    if(elements.length === 1) {
      return elements[0];
    }

    throw errors.expectedSectionGotSections(this.context, name, elements.map(element => element.instruction));
  }

  sections(name) {
    if(!this.elementsAssociative.hasOwnProperty(name)) {
      return [];
    }

    const elements = this.elementsAssociative[name];

    for(let element of elements) {
      element.touch();

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
    }

    return elements;
  }

  sequential() {
    return this.elementsSequential;
  }

  toString() {
    if(this.name === '<>#:=|\\_ENO_DOCUMENT') {
      return `[object EnoDocument length="${this.elementsSequential.length}"]`;
    } else {
      return `[object EnoSection name="${this.name}" length="${this.elementsSequential.length}"]`;
    }
  }

  touch() {
    this.touched = true;
  }
}

module.exports = EnoSection;
