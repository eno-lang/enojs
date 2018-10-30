const errors = require('../errors/validation.js');
const Empty = require('./empty.js');
const Field = require('./field.js');
const Fieldset = require('./fieldset.js');
const List = require('./list.js');
const loaders = require('../loaders.js');

// TODO: Investigate and possibly follow .explain() public audience (translated) debug output track :)
// TODO: For each value store the representational type as well ? (e.g. string may come from "- foo" or -- foo\nxxx\n-- foo) and use that for precise error messages?

class Section {
  constructor(context, instruction, parent) {
    this.context = context;
    this.depth = instruction.depth;
    this.instruction = instruction;
    this.name = instruction.name;
    this.parent = parent;

    this._elements = [];
    this.elementsAssociative = {};
    this._enforceAllElements = false;
    this.touched = false;

    instruction.element = this;

    const append = element => {
      this._elements.push(element);

      if(this.elementsAssociative.hasOwnProperty(element.name)) {
        this.elementsAssociative[element.name].push(element);
      } else {
        this.elementsAssociative[element.name] = [element];
      }
    };

    for(let subinstruction of instruction.subinstructions) {
      if(subinstruction.type === 'NOOP') {
        subinstruction.element = this;
      } else if(subinstruction.type === 'NAME') {
        append(new Empty(context, subinstruction, this));
      } else if(subinstruction.type === 'FIELD') {
        append(new Field(context, subinstruction, this));
      } else if(subinstruction.type === 'LIST') {
        append(new List(context, subinstruction, this));
      } else if(subinstruction.type === 'BLOCK') {
        append(new Field(context, subinstruction, this));
      } else if(subinstruction.type === 'FIELDSET') {
        append(new Fieldset(context, subinstruction, this));
      } else if(subinstruction.type === 'SECTION') {
        append(new Section(context, subinstruction, this));
      }
    }
  }

  get [Symbol.toStringTag]() {
    return 'Section';
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
            const value = element instanceof Fieldset ||
                          element instanceof Section ?
                          undefined : element.value();

            message = message({ name: element.name, value: value });
          }

          throw errors.excessName(this.context, message, element.instruction);
        }

        if(element instanceof Fieldset || element instanceof Section) {
          element.assertAllTouched(message);
        }
      }
    }
  }

  element(name, options = { enforceElement: true }) {
    if(options.required !== undefined) {
      options.enforceElement = options.required;
    }

    this.touched = true;

    if(!this.elementsAssociative.hasOwnProperty(name)) {
      if(options.enforceElement)
        throw errors.missingElement(this.context, name, this.instruction);

      return null;
    }

    const elements = this.elementsAssociative[name];

    if(elements.length > 1) {
      throw errors.expectedElementGotElements(
        this.context,
        name,
        elements.map(element => element.instruction)
      );
    }

    const element = elements[0];

    element.touch();

    return element;
  }

  elements() {
    this.touched = true;

    for(let element of this._elements) {
      element.touch();
    }

    return this._elements;
  }

  enforceAllElements(enforce = true) {
    this._enforceAllElements = enforce;

    for(let element of this._elements) {
      if(element instanceof Fieldset || element instanceof Section) {
        element.enforceAllElements(enforce);
      }
    }
  }

  field(name, ...optional) {
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

    if(!this.elementsAssociative.hasOwnProperty(name)) {
      if(options.enforceElement)
        throw errors.missingField(this.context, name, this.instruction);

      if(options.withElement)
        return { element: null, value: null };

      return null;
    }

    const elements = this.elementsAssociative[name];

    for(let element of elements) {
      if(element instanceof Field || element instanceof Empty)
        continue;

      if(element instanceof Fieldset)
        throw errors.expectedFieldGotFieldset(this.context, element.instruction);

      if(element instanceof List)
        throw errors.expectedFieldGotList(this.context, element.instruction);

      if(element instanceof Section)
        throw errors.expectedFieldGotSection(this.context, element.instruction);
    }

    if(elements.length > 1) {
      throw errors.expectedFieldGotFields(
        this.context,
        name,
        elements.map(element => element.instruction)
      );
    }

    let element = elements[0];

    element.touch();

    if(element instanceof Empty) {
      element = new Field(this.context, element.instruction, this, true);
    }

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

  fields(name) {
    this.touched = true;

    if(!this.elementsAssociative.hasOwnProperty(name))
      return [];

    const elements = this.elementsAssociative[name];

    return elements.map(element => {
      element.touch();

      if(element instanceof Field)
        return element;

      if(element instanceof Empty)
        return new Field(this.context, element.instruction, this, true);

      if(element instanceof Fieldset)
        throw errors.expectedFieldsGotFieldset(this.context, element.instruction);

      if(element instanceof List)
        throw errors.expectedFieldsGotList(this.context, element.instruction);

      if(element instanceof Section)
        throw errors.expectedFieldsGotSection(this.context, element.instruction);
    });
  }

  fieldset(name, ...optional) {
    let options = {
      enforceElement: true,
      required: undefined
    };

    for(let argument of optional) {
      if(typeof argument === 'object') {
        Object.assign(options, argument);
      }
    }

    if(options.required !== undefined) {
      options.enforceElement = options.required;
    }

    this.touched = true;

    if(!this.elementsAssociative.hasOwnProperty(name)) {
      if(options.enforceElement)
        throw errors.missingFieldset(this.context, name, this.instruction);

      return null;
    }

    const elements = this.elementsAssociative[name];

    for(let element of elements) {
      if(element instanceof Fieldset || element instanceof Empty)
        continue;

      if(element instanceof List)
        throw errors.expectedFieldsetGotList(this.context, element.instruction);

      if(element instanceof Section)
        throw errors.expectedFieldsetGotSection(this.context, element.instruction);

      if(element instanceof Field)
        throw errors.expectedFieldsetGotField(this.context, element.instruction);
    }

    if(elements.length > 1) {
      throw errors.expectedFieldsetGotFieldsets(
        this.context,
        name,
        elements.map(element => element.instruction)
      );
    }

    const element = elements[0];

    element.touch();

    if(element instanceof Empty)
      return new Fieldset(this.context, element.instruction, this, true);

    return element;
  }

  fieldsets(name) {
    this.touched = true;

    if(!this.elementsAssociative.hasOwnProperty(name)) {
      return [];
    }

    const elements = this.elementsAssociative[name];

    return elements.map(element => {
      element.touch();

      if(element instanceof Fieldset)
        return element;

      if(element instanceof Empty)
        return new Fieldset(this.context, element.instruction, this, true);

      if(element instanceof List)
        throw errors.expectedFieldsetsGotList(this.context, element.instruction);

      if(element instanceof Section)
        throw errors.expectedFieldsetsGotSection(this.context, element.instruction);

      if(element instanceof Field)
        throw errors.expectedFieldsetsGotField(this.context, element.instruction);
    });
  }

  // explain(indentation = '') {
  //   const results = [];
  //
  //   if(this.name === '<>#:=|\\_ENO_DOCUMENT') {
  //     results.push(`${indentation}${this.context.messages.inspection.document}`);
  //   } else {
  //     results.push(`${indentation}${'#'.repeat(this.depth)} ${this.name}`);
  //   }
  //
  //   indentation += '  ';
  //
  //   for(let element of this._elements) {
  //     if(element instanceof Empty) {
  //       results.push(`${indentation}${this.context.messages.inspection.empty} ${element.name}`);
  //       continue;
  //     }
  //
  //     if(element instanceof Field) {
  //       results.push(`${indentation}${element.name}: ${element.value}`);
  //       continue;
  //     }
  //
  //     if(element instanceof List) {
  //       results.push(element.inspect(indentation));
  //       continue;
  //     }
  //
  //     if(element instanceof Fieldset) {
  //       results.push(element.inspect(indentation));
  //       continue;
  //     }
  //
  //     if(element instanceof Section) {
  //       results.push(element.inspect(indentation));
  //       continue;
  //     }
  //   }
  //
  //   return results.join('\n');
  // }

  list(name, ...optional) {
    let options = {
      element: false,
      elements: false,
      enforceElement: this._enforceAllElements,
      enforceValues: true,
      exactCount: null,
      maxCount: null,
      minCount: null,
      required: undefined,
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

    if(options.required !== undefined) {
      options.enforceElement = options.required;
    }

    options.enforceElement = options.enforceElement ||
                             options.exactCount !== null && options.exactCount > 0 ||
                             options.minCount !== null && options.minCount > 0;

    this.touched = true;

    if(!this.elementsAssociative.hasOwnProperty(name)) {
      if(options.enforceElement)
        throw errors.missingList(this.context, name, this.instruction);

      return [];
    }

    const elements = this.elementsAssociative[name];

    for(let element of elements) {
      if(element instanceof List || element instanceof Empty)
        continue;

      if(element instanceof Field)
        throw errors.expectedListGotField(this.context, element.instruction);

      if(element instanceof Fieldset)
        throw errors.expectedListGotFieldset(this.context, element.instruction);

      if(element instanceof Section)
        throw errors.expectedListGotSection(this.context, element.instruction);
    }

    if(elements.length > 1) {
      throw errors.expectedListGotLists(
        this.context,
        name,
        elements.map(element => element.instruction)
      );
    }

    const element = elements[0];

    element.touch();

    const count = element instanceof Empty ? 0 : element.length();

    if(options.exactCount !== null && count !== options.exactCount)
      throw errors.exactCountNotMet(this.context, element.instruction, options.exactCount);

    if(options.minCount !== null && count < options.minCount)
      throw errors.minCountNotMet(this.context, element.instruction, options.minCount);

    if(options.maxCount !== null && count > options.maxCount)
      throw errors.maxCountNotMet(this.context, element.instruction, options.maxCount);

    if(element instanceof Empty)
      return [];

    if(options.element)
      return element;

    return element.items(loader, {
      elements: options.elements,
      enforceValues: options.enforceValues,
      withElements: options.withElements
    });
  }

  lists(name) {
    if(!this.elementsAssociative.hasOwnProperty(name))
      return [];

    const elements = this.elementsAssociative[name];

    return elements.map(element => {
      element.touch();

      if(element instanceof List) {
        return element;
      }

      if(element instanceof Empty) {
        return new List(this.context, element.instruction, this, true);
      }

      if(element instanceof Fieldset) {
        throw errors.expectedListsGotFieldset(this.context, element.instruction);
      }

      if(element instanceof Section) {
        throw errors.expectedListsGotSection(this.context, element.instruction);
      }

      if(element instanceof Field) {
        throw errors.expectedListsGotField(this.context, element.instruction);
      }
    });
  }

  lookup(...position) {
    let line, column;

    if(position.length === 2) {
      line = position[0];
      column = position [1];
    } else {
      const index_argument = position[0];
      let index = 0;
      line = 0;
      column = 0;
      while(index !== index_argument) {
        if(index >= this.context.input.length) return null;

        if(this.context.input.charAt(index) === '\n') {
          line++;
          column = 0;
        } else {
          column++;
        }

        index++;
      }
    }

    const instruction = this.context.instructions.find(instruction =>
      instruction.line === line
    );

    if(!instruction)
      return null;

    const result = {
      element: instruction.element,
      zone: 'element'
    };

    if(instruction.ranges) {
      let rightmostMatch = 0;

      for(let [type, range] of Object.entries(instruction.ranges)) {
        if(column >= range[0] && column <= range[1] && range[0] >= rightmostMatch) {
          result.zone = type;
          rightmostMatch = column;
        }
      }
    }

    return result;
  }

  raw() {
    const elements = this._elements.map(element => element.raw());

    if(this.name === '<>#:=|\\_ENO_DOCUMENT')
      return elements;

    return { [this.name]: elements };
  }

  section(name, ...optional) {
    let options = {
      enforceElement: true,
      required: undefined
    };

    for(let argument of optional) {
      if(typeof argument === 'object') {
        Object.assign(options, argument);
      }
    }

    if(options.required !== undefined) {
      options.enforceElement = options.required;
    }

    this.touched = true;

    if(!this.elementsAssociative.hasOwnProperty(name)) {
      if(options.enforceElement)
        throw errors.missingSection(this.context, name, this.instruction);

      return null;
    }

    const elements = this.elementsAssociative[name];

    for(let element of elements) {
      if(element instanceof Section)
        continue;

      if(element instanceof Fieldset)
        throw errors.expectedSectionGotFieldset(this.context, element.instruction);

      if(element instanceof Empty)
        throw errors.expectedSectionGotEmpty(this.context, element.instruction);

      if(element instanceof List)
        throw errors.expectedSectionGotList(this.context, element.instruction);

      if(element instanceof Field)
        throw errors.expectedSectionGotField(this.context, element.instruction);
    }

    if(elements.length > 1) {
      throw errors.expectedSectionGotSections(
        this.context,
        name,
        elements.map(element => element.instruction)
      );
    }

    elements[0].touch();

    return elements[0];
  }

  sections(name) {
    this.touched = true;

    if(!this.elementsAssociative.hasOwnProperty(name))
      return [];

    const elements = this.elementsAssociative[name];

    for(let element of elements) {
      element.touch();

      if(element instanceof Section)
        continue;

      if(element instanceof Fieldset)
        throw errors.expectedSectionsGotFieldset(this.context, element.instruction);

      if(element instanceof Empty)
        throw errors.expectedSectionsGotEmpty(this.context, element.instruction);

      if(element instanceof List)
        throw errors.expectedSectionsGotList(this.context, element.instruction);

      if(element instanceof Field)
        throw errors.expectedSectionsGotField(this.context, element.instruction);
    }

    return elements;
  }

  toString() {
    if(this.name === '<>#:=|\\_ENO_DOCUMENT')
      return `[object Section document elements=${this._elements.length}]`;

    return `[object Section name="${this.name}" elements=${this._elements.length}]`;
  }

  touch() {
    this.touched = true;
  }
}

Section.prototype.string = Section.prototype.field;
Section.prototype.stringList = Section.prototype.list;

for(let [name, func] of Object.entries(loaders)) {
  Section.prototype[name] = function(name, ...optional) {
    return this.field(name, func, ...optional);
  }

  Section.prototype[`${name}List`] = function(name, ...optional) {
    return this.list(name, func, ...optional);
  }
}

module.exports = Section;
