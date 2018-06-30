const { EnoValidationError } = require('../error_types.js');
const report = require('../reporters/report.js');

// TODO: Generalize some line gathering code for reporting / maybe even generalize whole error classes (in between, here, not the translations)
// TODO: Need to filter out copied subinstructions for print/selection ranges in some places
// TODO: Traverse down to get all sub-sub-sub-instructions in all branches? (with single helper function everywhere it applies)

const deepExpandInstruction = instruction => {
  const result = [instruction];

  if(instruction.subinstructions) {
    for(let subinstruction of instruction.subinstructions) {
      result.push(...deepExpandInstruction(subinstruction));
    }
  }

  return result;
};

const expandInstructions = instructions => {
  const result = [];

  for(let instruction of instructions) {
    result.push(instruction);

    if(instruction.subinstructions) {
      result.push(...instruction.subinstructions);
    }
  }

  return result;
};

module.exports = {

  exactCountNotMet: (context, instruction, exactCount) => {
    const message = context.messages.validation.exactCountNotMet(
      instruction.name,
      instruction.subinstructions ? instruction.subinstructions.length : 0,
      exactCount
    );

    let selection;
    let snippet;
    if(instruction.subinstructions && instruction.subinstructions.length > 0) {
      lastSubinstruction = instruction.subinstructions[instruction.subinstructions.length - 1];
      selection = [
        [instruction.subinstructions[0].line, 0],
        [lastSubinstruction.line, lastSubinstruction.length]
      ];
      snippet = report(context, instruction.subinstructions, instruction);
    } else {
      selection = [
        [instruction.line, instruction.length],
        [instruction.line, instruction.length]
      ];
      snippet = report(context, instruction);
    }

    return new EnoValidationError(message, snippet, selection);
  },

  excessName: (context, message, instruction) => {
    if(message === undefined) {
      message = context.messages.validation.excessName(instruction.name);
    }

    let snippet;
    const selection = [[instruction.line, 0]];
    if(instruction.subinstructions && instruction.subinstructions.length > 0) {
      snippet = report(context, [instruction, ...instruction.subinstructions]);
      const lastInstruction = instruction.subinstructions[instruction.subinstructions.length - 1];
      selection.push([lastInstruction.line, lastInstruction.length]);
    } else {
      snippet = report(context, instruction);
      selection.push([instruction.line, instruction.length]);
    }

    return new EnoValidationError(message, snippet, selection);
  },

  expectedDictionariesGotField: (context, instruction) => {
    const message = context.messages.validation.expectedDictionariesGotField(instruction.name);

    const snippet = report(context, [instruction, ...instruction.subinstructions]);

    const selection = [[instruction.line, 0]];
    if(instruction.subinstructions.length > 0) {
      const lastInstruction = instruction.subinstructions[instruction.subinstructions.length - 1];
      selection.push([lastInstruction.line, lastInstruction.length]);
    } else {
      selection.push([instruction.line, instruction.length]);
    }

    return new EnoValidationError(message, snippet, selection);
  },

  expectedDictionariesGotList: (context, instruction) => {
    const message = context.messages.validation.expectedDictionariesGotList(instruction.name);

    const snippet = report(context, [instruction, ...instruction.subinstructions]);

    const selection = [[instruction.line, 0]];
    if(instruction.subinstructions.length > 0) {
      const lastInstruction = instruction.subinstructions[instruction.subinstructions.length - 1];
      selection.push([lastInstruction.line, lastInstruction.length]);
    } else {
      selection.push([instruction.line, instruction.length]);
    }

    return new EnoValidationError(message, snippet, selection);
  },

  expectedDictionariesGotSection: (context, instruction) => {
    const message = context.messages.validation.expectedDictionariesGotSection(instruction.name);

    const snippet = report(context, [instruction, ...instruction.subinstructions]);

    const selection = [[instruction.line, 0]];
    if(instruction.subinstructions.length > 0) {
      const lastInstruction = instruction.subinstructions[instruction.subinstructions.length - 1];
      selection.push([lastInstruction.line, lastInstruction.length]);
    } else {
      selection.push([instruction.line, instruction.length]);
    }

    return new EnoValidationError(message, snippet, selection);
  },

  expectedDictionaryGotDictionaries: (context, name, instructions) => {
    const expandedInstructions = expandInstructions(instructions);
    const lastInstruction = expandedInstructions[expandedInstructions.length - 1];

    const message = context.messages.validation.expectedDictionaryGotDictionaries(name);

    const snippet = report(context, instructions, expandedInstructions);

    const selection = [
      [expandedInstructions[0].line, 0],
      [lastInstruction.line, lastInstruction.length]
    ];

    return new EnoValidationError(message, snippet, selection);
  },

  expectedDictionaryGotField: (context, instruction) => {
    const message = context.messages.validation.expectedDictionaryGotField(instruction.name);

    const snippet = report(context, [instruction, ...instruction.subinstructions]);

    const selection = [[instruction.line, 0]];
    if(instruction.subinstructions.length > 0) {
      const lastInstruction = instruction.subinstructions[instruction.subinstructions.length - 1];
      selection.push([lastInstruction.line, lastInstruction.length]);
    } else {
      selection.push([instruction.line, instruction.length]);
    }

    return new EnoValidationError(message, snippet, selection);
  },

  expectedDictionaryGotList: (context, instruction) => {
    const message = context.messages.validation.expectedDictionaryGotList(instruction.name);

    const snippet = report(context, [instruction, ...instruction.subinstructions]);

    const selection = [[instruction.line, 0]];
    if(instruction.subinstructions.length > 0) {
      const lastInstruction = instruction.subinstructions[instruction.subinstructions.length - 1];
      selection.push([lastInstruction.line, lastInstruction.length]);
    } else {
      selection.push([instruction.line, instruction.length]);
    }

    return new EnoValidationError(message, snippet, selection);
  },

  expectedDictionaryGotSection: (context, instruction) => {
    const message = context.messages.validation.expectedDictionaryGotSection(instruction.name);

    const snippet = report(context, [instruction, ...instruction.subinstructions]);

    const selection = [[instruction.line, 0]];
    if(instruction.subinstructions.length > 0) {
      const lastInstruction = instruction.subinstructions[instruction.subinstructions.length - 1];
      selection.push([lastInstruction.line, lastInstruction.length]);
    } else {
      selection.push([instruction.line, instruction.length]);
    }

    return new EnoValidationError(message, snippet, selection);
  },

  expectedElementGotElements: (context, name, instructions) => {
    const expandedInstructions = expandInstructions(instructions);
    const lastInstruction = expandedInstructions[expandedInstructions.length - 1];

    const message = context.messages.validation.expectedElementGotElements(name);

    const snippet = report(context, instructions, expandedInstructions);

    const selection = [
      [expandedInstructions[0].line, 0],
      [lastInstruction.line, lastInstruction.length]
    ];

    return new EnoValidationError(message, snippet, selection);
  },

  expectedFieldGotDictionary: (context, instruction) => {
    const message = context.messages.validation.expectedFieldGotDictionary(instruction.name);

    const snippet = report(context, [instruction, ...instruction.subinstructions]);

    const selection = [[instruction.line, 0]];
    if(instruction.subinstructions.length > 0) {
      const lastInstruction = instruction.subinstructions[instruction.subinstructions.length - 1];
      selection.push([lastInstruction.line, lastInstruction.length]);
    } else {
      selection.push([instruction.line, instruction.length]);
    }

    return new EnoValidationError(message, snippet, selection);
  },

  expectedFieldGotList: (context, instruction) => {
    const message = context.messages.validation.expectedFieldGotList(instruction.name);

    const snippet = report(context, [instruction, ...instruction.subinstructions]);

    const selection = [[instruction.line, 0]];
    if(instruction.subinstructions.length > 0) {
      const lastInstruction = instruction.subinstructions[instruction.subinstructions.length - 1];
      selection.push([lastInstruction.line, lastInstruction.length]);
    } else {
      selection.push([instruction.line, instruction.length]);
    }

    return new EnoValidationError(message, snippet, selection);
  },

  expectedFieldGotFields: (context, name, instructions) => {
    const expandedInstructions = expandInstructions(instructions);
    const lastInstruction = expandedInstructions[expandedInstructions.length - 1];

    const message = context.messages.validation.expectedFieldGotFields(name);

    const snippet = report(context, instructions, expandedInstructions);

    const selection = [
      [expandedInstructions[0].line, 0],
      [lastInstruction.line, lastInstruction.length]
    ];

    return new EnoValidationError(message, snippet, selection);
  },

  expectedFieldGotSection: (context, instruction) => {
    const message = context.messages.validation.expectedFieldGotSection(instruction.name);

    const snippet = report(context, [instruction, ...instruction.subinstructions]);

    const selection = [[instruction.line, 0]];
    if(instruction.subinstructions.length > 0) {
      const lastInstruction = instruction.subinstructions[instruction.subinstructions.length - 1];
      selection.push([lastInstruction.line, lastInstruction.length]);
    } else {
      selection.push([instruction.line, instruction.length]);
    }

    return new EnoValidationError(message, snippet, selection);
  },

  expectedFieldsGotDictionary: (context, instruction) => {
    const message = context.messages.validation.expectedFieldsGotDictionary(instruction.name);

    const snippet = report(context, [instruction, ...instruction.subinstructions]);

    const selection = [[instruction.line, 0]];
    if(instruction.subinstructions.length > 0) {
      const lastInstruction = instruction.subinstructions[instruction.subinstructions.length - 1];
      selection.push([lastInstruction.line, lastInstruction.length]);
    } else {
      selection.push([instruction.line, instruction.length]);
    }

    return new EnoValidationError(message, snippet, selection);
  },

  expectedFieldsGotList: (context, instruction) => {
    const message = context.messages.validation.expectedFieldsGotList(instruction.name);

    const snippet = report(context, [instruction, ...instruction.subinstructions]);

    const selection = [[instruction.line, 0]];
    if(instruction.subinstructions.length > 0) {
      const lastInstruction = instruction.subinstructions[instruction.subinstructions.length - 1];
      selection.push([lastInstruction.line, lastInstruction.length]);
    } else {
      selection.push([instruction.line, instruction.length]);
    }

    return new EnoValidationError(message, snippet, selection);
  },

  expectedFieldsGotSection: (context, instruction) => {
    const message = context.messages.validation.expectedFieldsGotSection(instruction.name);

    const snippet = report(context, [instruction, ...instruction.subinstructions]);

    const selection = [[instruction.line, 0]];
    if(instruction.subinstructions.length > 0) {
      const lastInstruction = instruction.subinstructions[instruction.subinstructions.length - 1];
      selection.push([lastInstruction.line, lastInstruction.length]);
    } else {
      selection.push([instruction.line, instruction.length]);
    }

    return new EnoValidationError(message, snippet, selection);
  },

  expectedListGotDictionary: (context, instruction) => {
    const message = context.messages.validation.expectedListGotDictionary(instruction.name);

    const snippet = report(context, [instruction, ...instruction.subinstructions]);

    const selection = [[instruction.line, 0]];
    if(instruction.subinstructions.length > 0) {
      const lastInstruction = instruction.subinstructions[instruction.subinstructions.length - 1];
      selection.push([lastInstruction.line, lastInstruction.length]);
    } else {
      selection.push([instruction.line, instruction.length]);
    }

    return new EnoValidationError(message, snippet, selection);
  },

  expectedListGotField: (context, instruction) => {
    const message = context.messages.validation.expectedListGotField(instruction.name);

    const snippet = report(context, [instruction, ...instruction.subinstructions]);

    const selection = [[instruction.line, 0]];
    if(instruction.subinstructions.length > 0) {
      const lastInstruction = instruction.subinstructions[instruction.subinstructions.length - 1];
      selection.push([lastInstruction.line, lastInstruction.length]);
    } else {
      selection.push([instruction.line, instruction.length]);
    }

    return new EnoValidationError(message, snippet, selection);
  },

  expectedListGotLists: (context, name, instructions) => {
    const expandedInstructions = expandInstructions(instructions);
    const lastInstruction = expandedInstructions[expandedInstructions.length - 1];

    const message = context.messages.validation.expectedListGotLists(name);

    const snippet = report(context, instructions, expandedInstructions);

    const selection = [
      [expandedInstructions[0].line, 0],
      [lastInstruction.line, lastInstruction.length]
    ];

    return new EnoValidationError(message, snippet, selection);
  },

  expectedListGotSection: (context, instruction) => {
    const message = context.messages.validation.expectedListGotSection(instruction.name);

    const snippet = report(context, [instruction, ...instruction.subinstructions]);

    const selection = [[instruction.line, 0]];
    if(instruction.subinstructions.length > 0) {
      const lastInstruction = instruction.subinstructions[instruction.subinstructions.length - 1];
      selection.push([lastInstruction.line, lastInstruction.length]);
    } else {
      selection.push([instruction.line, instruction.length]);
    }

    return new EnoValidationError(message, snippet, selection);
  },

  expectedListsGotDictionary: (context, instruction) => {
    const message = context.messages.validation.expectedListsGotDictionary(instruction.name);

    const snippet = report(context, [instruction, ...instruction.subinstructions]);

    const selection = [[instruction.line, 0]];
    if(instruction.subinstructions.length > 0) {
      const lastInstruction = instruction.subinstructions[instruction.subinstructions.length - 1];
      selection.push([lastInstruction.line, lastInstruction.length]);
    } else {
      selection.push([instruction.line, instruction.length]);
    }

    return new EnoValidationError(message, snippet, selection);
  },

  expectedListsGotField: (context, instruction) => {
    const message = context.messages.validation.expectedListsGotField(instruction.name);

    const snippet = report(context, [instruction, ...instruction.subinstructions]);

    const selection = [[instruction.line, 0]];
    if(instruction.subinstructions.length > 0) {
      const lastInstruction = instruction.subinstructions[instruction.subinstructions.length - 1];
      selection.push([lastInstruction.line, lastInstruction.length]);
    } else {
      selection.push([instruction.line, instruction.length]);
    }

    return new EnoValidationError(message, snippet, selection);
  },

  expectedListsGotSection: (context, instruction) => {
    const message = context.messages.validation.expectedListsGotSection(instruction.name);

    const snippet = report(context, [instruction, ...instruction.subinstructions]);

    const selection = [[instruction.line, 0]];
    if(instruction.subinstructions.length > 0) {
      const lastInstruction = instruction.subinstructions[instruction.subinstructions.length - 1];
      selection.push([lastInstruction.line, lastInstruction.length]);
    } else {
      selection.push([instruction.line, instruction.length]);
    }

    return new EnoValidationError(message, snippet, selection);
  },

  expectedSectionGotDictionary: (context, instruction) => {
    const message = context.messages.validation.expectedSectionGotDictionary(instruction.name);

    const snippet = report(context, [instruction, ...instruction.subinstructions]);

    const selection = [[instruction.line, 0]];
    if(instruction.subinstructions.length > 0) {
      const lastInstruction = instruction.subinstructions[instruction.subinstructions.length - 1];
      selection.push([lastInstruction.line, lastInstruction.length]);
    } else {
      selection.push([instruction.line, instruction.length]);
    }

    return new EnoValidationError(message, snippet, selection);
  },

  expectedSectionGotEmpty: (context, instruction) => {
    const message = context.messages.validation.expectedSectionGotEmpty(instruction.name);

    const snippet = report(context, instruction);

    const selection = [
      [instruction.line, 0],
      [instruction.line, instruction.length]
    ];

    return new EnoValidationError(message, snippet, selection);
  },

  expectedSectionGotField: (context, instruction) => {
    const message = context.messages.validation.expectedSectionGotField(instruction.name);

    const snippet = report(context, [instruction, ...instruction.subinstructions]);

    const selection = [[instruction.line, 0]];
    if(instruction.subinstructions.length > 0) {
      const lastInstruction = instruction.subinstructions[instruction.subinstructions.length - 1];
      selection.push([lastInstruction.line, lastInstruction.length]);
    } else {
      selection.push([instruction.line, instruction.length]);
    }

    return new EnoValidationError(message, snippet, selection);
  },

  expectedSectionGotList: (context, instruction) => {
    const message = context.messages.validation.expectedSectionGotList(instruction.name);

    const snippet = report(context, [instruction, ...instruction.subinstructions]);

    const selection = [[instruction.line, 0]];
    if(instruction.subinstructions.length > 0) {
      const lastInstruction = instruction.subinstructions[instruction.subinstructions.length - 1];
      selection.push([lastInstruction.line, lastInstruction.length]);
    } else {
      selection.push([instruction.line, instruction.length]);
    }

    return new EnoValidationError(message, snippet, selection);
  },

  expectedSectionGotSections: (context, name, instructions) => {
    const expandedInstructions = expandInstructions(instructions);
    const lastInstruction = expandedInstructions[expandedInstructions.length - 1];

    const message = context.messages.validation.expectedSectionGotSections(name);

    const snippet = report(context, instructions, expandedInstructions);

    const selection = [
      [expandedInstructions[0].line, 0],
      [lastInstruction.line, lastInstruction.length]
    ];

    return new EnoValidationError(message, snippet, selection);
  },

  expectedSectionsGotDictionary: (context, instruction) => {
    const message = context.messages.validation.expectedSectionsGotDictionary(instruction.name);

    const snippet = report(context, [instruction, ...instruction.subinstructions]);

    const selection = [[instruction.line, 0]];
    if(instruction.subinstructions.length > 0) {
      const lastInstruction = instruction.subinstructions[instruction.subinstructions.length - 1];
      selection.push([lastInstruction.line, lastInstruction.length]);
    } else {
      selection.push([instruction.line, instruction.length]);
    }

    return new EnoValidationError(message, snippet, selection);
  },

  expectedSectionsGotEmpty: (context, instruction) => {
    const message = context.messages.validation.expectedSectionsGotEmpty(instruction.name);

    const snippet = report(context, [instruction, ...instruction.subinstructions]);

    const selection = [[instruction.line, 0]];
    if(instruction.subinstructions.length > 0) {
      const lastInstruction = instruction.subinstructions[instruction.subinstructions.length - 1];
      selection.push([lastInstruction.line, lastInstruction.length]);
    } else {
      selection.push([instruction.line, instruction.length]);
    }

    return new EnoValidationError(message, snippet, selection);
  },

  expectedSectionsGotField: (context, instruction) => {
    const message = context.messages.validation.expectedSectionsGotField(instruction.name);

    const snippet = report(context, [instruction, ...instruction.subinstructions]);

    const selection = [[instruction.line, 0]];
    if(instruction.subinstructions.length > 0) {
      const lastInstruction = instruction.subinstructions[instruction.subinstructions.length - 1];
      selection.push([lastInstruction.line, lastInstruction.length]);
    } else {
      selection.push([instruction.line, instruction.length]);
    }

    return new EnoValidationError(message, snippet, selection);
  },

  expectedSectionsGotList: (context, instruction) => {
    const message = context.messages.validation.expectedSectionsGotList(instruction.name);

    const snippet = report(context, [instruction, ...instruction.subinstructions]);

    const selection = [[instruction.line, 0]];
    if(instruction.subinstructions.length > 0) {
      const lastInstruction = instruction.subinstructions[instruction.subinstructions.length - 1];
      selection.push([lastInstruction.line, lastInstruction.length]);
    } else {
      selection.push([instruction.line, instruction.length]);
    }

    return new EnoValidationError(message, snippet, selection);
  },

  maxCountNotMet: (context, instruction, maxCount) => {
    const message = context.messages.validation.maxCountNotMet(
      instruction.name,
      instruction.subinstructions ? instruction.subinstructions.length : 0,
      maxCount
    );

    let selection;
    let snippet;
    if(instruction.subinstructions && instruction.subinstructions.length > 0) {
      lastSubinstruction = instruction.subinstructions[instruction.subinstructions.length - 1];
      selection = [
        [instruction.subinstructions[0].line, 0],
        [lastSubinstruction.line, lastSubinstruction.length]
      ];
      snippet = report(context, instruction.subinstructions, instruction);
    } else {
      selection = [
        [instruction.line, instruction.length],
        [instruction.line, instruction.length]
      ];
      snippet = report(context, instruction);
    }

    return new EnoValidationError(message, snippet, selection);
  },

  minCountNotMet: (context, instruction, minCount) => {
    const message = context.messages.validation.minCountNotMet(
      instruction.name,
      instruction.subinstructions ? instruction.subinstructions.length : 0,
      minCount
    );

    let selection;
    let snippet;
    if(instruction.subinstructions && instruction.subinstructions.length > 0) {
      lastSubinstruction = instruction.subinstructions[instruction.subinstructions.length - 1];
      selection = [
        [instruction.subinstructions[0].line, 0],
        [lastSubinstruction.line, lastSubinstruction.length]
      ];
      snippet = report(context, instruction.subinstructions, instruction);
    } else {
      selection = [
        [instruction.line, instruction.length],
        [instruction.line, instruction.length]
      ];
      snippet = report(context, instruction);
    }

    return new EnoValidationError(message, snippet, selection);
  },

  // TODO: Exclude sections within sections for all the missing* errors (except missingDictionaryEntry)

  missingDictionary: (context, name, sectionInstruction) => {
    const message = context.messages.validation.missingDictionary(name);

    const snippet = report(context, sectionInstruction, deepExpandInstruction(sectionInstruction));

    const selection = [
      [sectionInstruction.line, sectionInstruction.length],
      [sectionInstruction.line, sectionInstruction.length]
    ];

    return new EnoValidationError(message, snippet, selection);
  },

  missingDictionaryEntry: (context, name, dictionaryInstruction) => {
    const message = context.messages.validation.missingDictionaryEntry(name);

    const snippet = report(context, dictionaryInstruction, deepExpandInstruction(dictionaryInstruction));

    const selection = [
      [dictionaryInstruction.line, dictionaryInstruction.length],
      [dictionaryInstruction.line, dictionaryInstruction.length]
    ];

    return new EnoValidationError(message, snippet, selection);
  },

  missingElement: (context, name, sectionInstruction) => {
    const message = context.messages.validation.missingElement(name);

    const snippet = report(context, sectionInstruction, deepExpandInstruction(sectionInstruction));

    const selection = [
      [sectionInstruction.line, sectionInstruction.length],
      [sectionInstruction.line, sectionInstruction.length]
    ];

    return new EnoValidationError(message, snippet, selection);
  },

  missingField: (context, name, sectionInstruction) => {
    const message = context.messages.validation.missingField(name);

    const snippet = report(context, sectionInstruction, deepExpandInstruction(sectionInstruction));

    const selection = [
      [sectionInstruction.line, sectionInstruction.length],
      [sectionInstruction.line, sectionInstruction.length]
    ];

    return new EnoValidationError(message, snippet, selection);
  },

  missingList: (context, name, sectionInstruction) => {
    const message = context.messages.validation.missingList(name);

    const snippet = report(context, sectionInstruction, deepExpandInstruction(sectionInstruction));

    const selection = [
      [sectionInstruction.line, sectionInstruction.length],
      [sectionInstruction.line, sectionInstruction.length]
    ];

    return new EnoValidationError(message, snippet, selection);
  },

  missingSection: (context, name, sectionInstruction) => {
    const message = context.messages.validation.missingSection(name);

    const snippet = report(context, sectionInstruction, deepExpandInstruction(sectionInstruction));

    const selection = [
      [sectionInstruction.line, sectionInstruction.length],
      [sectionInstruction.line, sectionInstruction.length]
    ];

    return new EnoValidationError(message, snippet, selection);
  },

  // TODO: Revisit and polish the two core value errors again at some point (missingValue / valueError)
  //       (In terms of quality of results and architecture - DRY up probably)
  //       Share best implementation among other eno libraries

  missingValue: (context, instruction) => {
    let message, selection;

    if(instruction.type === 'FIELD' || instruction.type === 'NAME' || instruction.type === 'BLOCK') {
      message = context.messages.validation.missingFieldValue(instruction.name);

      if(instruction.ranges.hasOwnProperty('template')) {
        selection = [[instruction.line, instruction.ranges.template[1]]];
      } else if(instruction.ranges.hasOwnProperty('nameOperator')) {
        selection = [[
          instruction.line,
          Math.min(instruction.ranges.nameOperator[1] + 1, instruction.length)
        ]];
      } else {
        selection = [[instruction.line, instruction.length]];
      }
    } else if(instruction.type === 'DICTIONARY_ENTRY') {
      message = context.messages.validation.missingDictionaryEntryValue(instruction.name);
      selection = [[
        instruction.line,
        Math.min(instruction.ranges.entryOperator[1] + 1, instruction.length)
      ]];
    } else if(instruction.type === 'LIST_ITEM') {
      message = context.messages.validation.missingListItemValue(instruction.name);
      selection = [[
        instruction.line,
        Math.min(instruction.ranges.itemOperator[1] + 1, instruction.length)
      ]];
    }

    const snippet = report(context, instruction, deepExpandInstruction(instruction));

    if(instruction.type !== 'BLOCK' &&
       instruction.subinstructions && instruction.subinstructions.length > 0) {
      const lastInstruction = instruction.subinstructions[instruction.subinstructions.length - 1];
      selection.push([lastInstruction.line, lastInstruction.length]);
    } else {
      selection.push([instruction.line, instruction.length]);
    }

    return new EnoValidationError(message, snippet, selection);
  },

  valueError: (context, message, instruction) => {
    console.log(context.instructions)

    if(message === undefined) {
      message = context.messages.validation.genericError(instruction.name);
    }

    let snippet, selection;

    if(instruction.type === 'BLOCK') {
      const contentInstructions = instruction.subinstructions.filter(instruction =>
        instruction.type === 'BLOCK_CONTENT'
      );
      const terminatorInstruction = instruction.subinstructions[instruction.subinstructions.length -1];

      if(contentInstructions.length > 0) {
        const firstInstruction = contentInstructions[0];
        const lastInstruction = contentInstructions[contentInstructions.length - 1];

        snippet = report(context, contentInstructions);
        selection = [
          [firstInstruction.line, firstInstruction.ranges.content[0]],
          [lastInstruction.line, lastInstruction.ranges.content[1]]
        ];
      } else {
        snippet = report(context, [instruction, terminatorInstruction]);
        selection = [
          [instruction.line, instruction.length],
          [instruction.line, instruction.length]
        ];
      }
    } else {
      snippet = report(context, deepExpandInstruction(instruction));

      if(instruction.ranges.hasOwnProperty('value')) {
        selection = [[instruction.line, instruction.ranges.value[0]]];
      } else if(instruction.ranges.hasOwnProperty('template')) {
        selection = [[instruction.line, instruction.ranges.templateOperator[0]]];
      } else if(instruction.ranges.hasOwnProperty('nameOperator')) {
        selection = [[
          instruction.line,
          Math.min(instruction.ranges.nameOperator[1] + 1, instruction.length)
        ]];
      } else if(instruction.ranges.hasOwnProperty('entryOperator')) {
        selection = [[
          instruction.line,
          Math.min(instruction.ranges.entryOperator[1] + 1, instruction.length)
        ]];
      } else if(instruction.type === 'LIST_ITEM') {
        selection = [[
          instruction.line,
          Math.min(instruction.ranges.itemOperator[1] + 1, instruction.length)
        ]];
      } else {
        selection = [[instruction.line, instruction.length]];
      }

      if(instruction.subinstructions && instruction.subinstructions.length > 0) {
        const lastInstruction = instruction.subinstructions[instruction.subinstructions.length - 1];
        selection.push([lastInstruction.line, lastInstruction.length]);
      } else {
        if(instruction.ranges.hasOwnProperty('value')) {
          selection.push([instruction.line, instruction.ranges.value[1]]);
        } else {
          selection.push([instruction.line, instruction.length]);
        }
      }
    }

    return new EnoValidationError(message, snippet, selection);
  }

};
