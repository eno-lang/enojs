const { EnoValidationError } = require('../errors.js');
const report = require('../reporters/report.js');

// TODO: Generalize some line gathering code for reporting / maybe even generalize whole error classes (in between, here, not the translations)
// TODO: Need to filter out copied subinstructions for print/selection ranges in some places
// TODO: Traverse down to get all sub-sub-sub-instructions in all branches? (with single helper function everywhere it applies)
// TODO: Account for 'missing value' vs. 'missing element' differentiation where it applies

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

  exactCountNotMet: (context, name, instructions, expectedCount, sectionInstruction) => {
    const message = context.messages.validation.exactCountNotMet(
      name,
      instructions.count,
      expectedCount
    );

    let selection;
    let snippet;
    if(instructions.length > 0) {
      selection = [[instructions[0].lineNumber, 0], [instructions[0].lineNumber, 0]];
      snippet = report(context, instructions);
    } else {
      if(sectionInstruction.lineNumber < context.instructions.length) {
        selection = [[sectionInstruction.lineNumber + 1, 0], [sectionInstruction.lineNumber + 1, 0]];
      } else {
        selection = [
          [sectionInstruction.lineNumber, sectionInstruction.line.length],
          [sectionInstruction.lineNumber, sectionInstruction.line.length]
        ];
      }
      snippet = report(context, sectionInstruction.subinstructions);
    }

    return new EnoValidationError(message, snippet, selection);
  },

  excessName: (context, message, instruction) => {
    if(message === undefined) {
      message = context.messages.validation.excessName(instruction.name);
    }

    let snippet;
    const selection = [[instruction.lineNumber, 0]];
    if(instruction.subinstructions && instruction.subinstructions.length > 0) {
      snippet = report(context, [instruction, ...instruction.subinstructions]);
      const lastInstruction = instruction.subinstructions[instruction.subinstructions.length - 1];
      selection.push([lastInstruction.lineNumber, lastInstruction.line.length]);
    } else {
      snippet = report(context, instruction);
      selection.push([instruction.lineNumber, instruction.line.length]);
    }

    return new EnoValidationError(message, snippet, selection);
  },

  expectedDictionariesGotField: (context, instruction) => {
    const message = context.messages.validation.expectedDictionariesGotField(instruction.name);
    const snippet = report(context, [instruction, ...instruction.subinstructions]);
    const selection = [[instruction.lineNumber, 0]];

    if(instruction.subinstructions.length > 0) {
      const lastInstruction = instruction.subinstructions[instruction.subinstructions.length - 1];
      selection.push([lastInstruction.lineNumber, lastInstruction.line.length]);
    } else {
      selection.push([instruction.lineNumber, instruction.line.length]);
    }

    return new EnoValidationError(message, snippet, selection);
  },

  expectedDictionariesGotList: (context, instruction) => {
    const message = context.messages.validation.expectedDictionariesGotList(instruction.name);
    const snippet = report(context, [instruction, ...instruction.subinstructions]);
    const selection = [[instruction.lineNumber, 0]];

    if(instruction.subinstructions.length > 0) {
      const lastInstruction = instruction.subinstructions[instruction.subinstructions.length - 1];
      selection.push([lastInstruction.lineNumber, lastInstruction.line.length]);
    } else {
      selection.push([instruction.lineNumber, instruction.line.length]);
    }

    return new EnoValidationError(message, snippet, selection);
  },

  expectedDictionariesGotSection: (context, instruction) => {
    const message = context.messages.validation.expectedDictionariesGotSection(instruction.name);
    const snippet = report(context, [instruction, ...instruction.subinstructions]);
    const selection = [[instruction.lineNumber, 0]];

    if(instruction.subinstructions.length > 0) {
      const lastInstruction = instruction.subinstructions[instruction.subinstructions.length - 1];
      selection.push([lastInstruction.lineNumber, lastInstruction.line.length]);
    } else {
      selection.push([instruction.lineNumber, instruction.line.length]);
    }

    return new EnoValidationError(message, snippet, selection);
  },

  expectedDictionaryGotDictionaries: (context, name, instructions) => {
    const expandedInstructions = expandInstructions(instructions);
    const lastInstruction = expandedInstructions[expandedInstructions.length - 1];

    const message = context.messages.validation.expectedDictionaryGotDictionaries(name);
    const snippet = report(context, instructions, expandedInstructions);
    const selection = [
      [expandedInstructions[0].lineNumber, 0],
      [lastInstruction.lineNumber, lastInstruction.line.length]
    ];

    return new EnoValidationError(message, snippet, selection);
  },

  expectedDictionaryGotField: (context, instruction) => {
    const message = context.messages.validation.expectedDictionaryGotField(instruction.name);
    const snippet = report(context, [instruction, ...instruction.subinstructions]);
    const selection = [[instruction.lineNumber, 0]];

    if(instruction.subinstructions.length > 0) {
      const lastInstruction = instruction.subinstructions[instruction.subinstructions.length - 1];
      selection.push([lastInstruction.lineNumber, lastInstruction.line.length]);
    } else {
      selection.push([instruction.lineNumber, instruction.line.length]);
    }

    return new EnoValidationError(message, snippet, selection);
  },

  expectedDictionaryGotList: (context, instruction) => {
    const message = context.messages.validation.expectedDictionaryGotList(instruction.name);
    const snippet = report(context, [instruction, ...instruction.subinstructions]);
    const selection = [[instruction.lineNumber, 0]];

    if(instruction.subinstructions.length > 0) {
      const lastInstruction = instruction.subinstructions[instruction.subinstructions.length - 1];
      selection.push([lastInstruction.lineNumber, lastInstruction.line.length]);
    } else {
      selection.push([instruction.lineNumber, instruction.line.length]);
    }

    return new EnoValidationError(message, snippet, selection);
  },

  expectedDictionaryGotSection: (context, instruction) => {
    const message = context.messages.validation.expectedDictionaryGotSection(instruction.name);
    const snippet = report(context, [instruction, ...instruction.subinstructions]);
    const selection = [[instruction.lineNumber, 0]];

    if(instruction.subinstructions.length > 0) {
      const lastInstruction = instruction.subinstructions[instruction.subinstructions.length - 1];
      selection.push([lastInstruction.lineNumber, lastInstruction.line.length]);
    } else {
      selection.push([instruction.lineNumber, instruction.line.length]);
    }

    return new EnoValidationError(message, snippet, selection);
  },

  expectedFieldGotDictionary: (context, instruction) => {
    const message = context.messages.validation.expectedFieldGotDictionary(instruction.name);
    const snippet = report(context, [instruction, ...instruction.subinstructions]);
    const selection = [[instruction.lineNumber, 0]];

    if(instruction.subinstructions.length > 0) {
      const lastInstruction = instruction.subinstructions[instruction.subinstructions.length - 1];
      selection.push([lastInstruction.lineNumber, lastInstruction.line.length]);
    } else {
      selection.push([instruction.lineNumber, instruction.line.length]);
    }

    return new EnoValidationError(message, snippet, selection);
  },

  expectedFieldGotList: (context, instruction) => {
    const message = context.messages.validation.expectedFieldGotList(instruction.name);
    const snippet = report(context, [instruction, ...instruction.subinstructions]);
    const selection = [[instruction.lineNumber, 0]];

    if(instruction.subinstructions.length > 0) {
      const lastInstruction = instruction.subinstructions[instruction.subinstructions.length - 1];
      selection.push([lastInstruction.lineNumber, lastInstruction.line.length]);
    } else {
      selection.push([instruction.lineNumber, instruction.line.length]);
    }

    return new EnoValidationError(message, snippet, selection);
  },

  expectedFieldGotFields: (context, name, instructions) => {
    const expandedInstructions = expandInstructions(instructions);
    const lastInstruction = expandedInstructions[expandedInstructions.length - 1];

    const message = context.messages.validation.expectedFieldGotFields(name);
    const snippet = report(context, instructions, expandedInstructions);
    const selection = [
      [expandedInstructions[0].lineNumber, 0],
      [lastInstruction.lineNumber, lastInstruction.line.length]
    ];

    return new EnoValidationError(message, snippet, selection);
  },

  expectedFieldGotSection: (context, instruction) => {
    const message = context.messages.validation.expectedFieldGotSection(instruction.name);
    const snippet = report(context, [instruction, ...instruction.subinstructions]);
    const selection = [[instruction.lineNumber, 0]];

    if(instruction.subinstructions.length > 0) {
      const lastInstruction = instruction.subinstructions[instruction.subinstructions.length - 1];
      selection.push([lastInstruction.lineNumber, lastInstruction.line.length]);
    } else {
      selection.push([instruction.lineNumber, instruction.line.length]);
    }

    return new EnoValidationError(message, snippet, selection);
  },

  expectedFieldsGotDictionary: (context, instruction) => {
    const message = context.messages.validation.expectedFieldsGotDictionary(instruction.name);
    const snippet = report(context, [instruction, ...instruction.subinstructions]);
    const selection = [[instruction.lineNumber, 0]];

    if(instruction.subinstructions.length > 0) {
      const lastInstruction = instruction.subinstructions[instruction.subinstructions.length - 1];
      selection.push([lastInstruction.lineNumber, lastInstruction.line.length]);
    } else {
      selection.push([instruction.lineNumber, instruction.line.length]);
    }

    return new EnoValidationError(message, snippet, selection);
  },

  expectedFieldsGotList: (context, instruction) => {
    const message = context.messages.validation.expectedFieldsGotList(instruction.name);
    const snippet = report(context, [instruction, ...instruction.subinstructions]);
    const selection = [[instruction.lineNumber, 0]];

    if(instruction.subinstructions.length > 0) {
      const lastInstruction = instruction.subinstructions[instruction.subinstructions.length - 1];
      selection.push([lastInstruction.lineNumber, lastInstruction.line.length]);
    } else {
      selection.push([instruction.lineNumber, instruction.line.length]);
    }

    return new EnoValidationError(message, snippet, selection);
  },

  expectedFieldsGotSection: (context, instruction) => {
    const message = context.messages.validation.expectedFieldsGotSection(instruction.name);
    const snippet = report(context, [instruction, ...instruction.subinstructions]);
    const selection = [[instruction.lineNumber, 0]];

    if(instruction.subinstructions.length > 0) {
      const lastInstruction = instruction.subinstructions[instruction.subinstructions.length - 1];
      selection.push([lastInstruction.lineNumber, lastInstruction.line.length]);
    } else {
      selection.push([instruction.lineNumber, instruction.line.length]);
    }

    return new EnoValidationError(message, snippet, selection);
  },

  expectedListGotDictionary: (context, instruction) => {
    const message = context.messages.validation.expectedListGotDictionary(instruction.name);
    const snippet = report(context, [instruction, ...instruction.subinstructions]);
    const selection = [[instruction.lineNumber, 0]];

    if(instruction.subinstructions.length > 0) {
      const lastInstruction = instruction.subinstructions[instruction.subinstructions.length - 1];
      selection.push([lastInstruction.lineNumber, lastInstruction.line.length]);
    } else {
      selection.push([instruction.lineNumber, instruction.line.length]);
    }

    return new EnoValidationError(message, snippet, selection);
  },

  expectedListGotSection: (context, instruction) => {
    const message = context.messages.validation.expectedListGotSection(instruction.name);
    const snippet = report(context, [instruction, ...instruction.subinstructions]);
    const selection = [[instruction.lineNumber, 0]];

    if(instruction.subinstructions.length > 0) {
      const lastInstruction = instruction.subinstructions[instruction.subinstructions.length - 1];
      selection.push([lastInstruction.lineNumber, lastInstruction.line.length]);
    } else {
      selection.push([instruction.lineNumber, instruction.line.length]);
    }

    return new EnoValidationError(message, snippet, selection);
  },

  expectedListsGotDictionary: (context, instruction) => {
    const message = context.messages.validation.expectedListsGotDictionary(instruction.name);
    const snippet = report(context, [instruction, ...instruction.subinstructions]);
    const selection = [[instruction.lineNumber, 0]];

    if(instruction.subinstructions.length > 0) {
      const lastInstruction = instruction.subinstructions[instruction.subinstructions.length - 1];
      selection.push([lastInstruction.lineNumber, lastInstruction.line.length]);
    } else {
      selection.push([instruction.lineNumber, instruction.line.length]);
    }

    return new EnoValidationError(message, snippet, selection);
  },

  expectedListsGotField: (context, instruction) => {
    const message = context.messages.validation.expectedListsGotField(instruction.name);
    const snippet = report(context, [instruction, ...instruction.subinstructions]);
    const selection = [[instruction.lineNumber, 0]];

    if(instruction.subinstructions.length > 0) {
      const lastInstruction = instruction.subinstructions[instruction.subinstructions.length - 1];
      selection.push([lastInstruction.lineNumber, lastInstruction.line.length]);
    } else {
      selection.push([instruction.lineNumber, instruction.line.length]);
    }

    return new EnoValidationError(message, snippet, selection);
  },

  expectedListsGotSection: (context, instruction) => {
    const message = context.messages.validation.expectedListsGotSection(instruction.name);
    const snippet = report(context, [instruction, ...instruction.subinstructions]);
    const selection = [[instruction.lineNumber, 0]];

    if(instruction.subinstructions.length > 0) {
      const lastInstruction = instruction.subinstructions[instruction.subinstructions.length - 1];
      selection.push([lastInstruction.lineNumber, lastInstruction.line.length]);
    } else {
      selection.push([instruction.lineNumber, instruction.line.length]);
    }

    return new EnoValidationError(message, snippet, selection);
  },

  expectedSectionGotDictionary: (context, instruction) => {
    const message = context.messages.validation.expectedSectionGotDictionary(instruction.name);
    const snippet = report(context, [instruction, ...instruction.subinstructions]);
    const selection = [[instruction.lineNumber, 0]];

    if(instruction.subinstructions.length > 0) {
      const lastInstruction = instruction.subinstructions[instruction.subinstructions.length - 1];
      selection.push([lastInstruction.lineNumber, lastInstruction.line.length]);
    } else {
      selection.push([instruction.lineNumber, instruction.line.length]);
    }

    return new EnoValidationError(message, snippet, selection);
  },

  expectedSectionGotEmpty: (context, instruction) => {
    const message = context.messages.validation.expectedSectionGotEmpty(instruction.name);
    const snippet = report(context, instruction);
    const selection = [
      [instruction.lineNumber, 0],
      [instruction.lineNumber, instruction.line.length]
    ];

    return new EnoValidationError(message, snippet, selection);
  },

  expectedSectionGotField: (context, instruction) => {
    const message = context.messages.validation.expectedSectionGotField(instruction.name);
    const snippet = report(context, [instruction, ...instruction.subinstructions]);
    const selection = [[instruction.lineNumber, 0]];

    if(instruction.subinstructions.length > 0) {
      const lastInstruction = instruction.subinstructions[instruction.subinstructions.length - 1];
      selection.push([lastInstruction.lineNumber, lastInstruction.line.length]);
    } else {
      selection.push([instruction.lineNumber, instruction.line.length]);
    }

    return new EnoValidationError(message, snippet, selection);
  },

  expectedSectionGotList: (context, instruction) => {
    const message = context.messages.validation.expectedSectionGotList(instruction.name);
    const snippet = report(context, [instruction, ...instruction.subinstructions]);
    const selection = [[instruction.lineNumber, 0]];

    if(instruction.subinstructions.length > 0) {
      const lastInstruction = instruction.subinstructions[instruction.subinstructions.length - 1];
      selection.push([lastInstruction.lineNumber, lastInstruction.line.length]);
    } else {
      selection.push([instruction.lineNumber, instruction.line.length]);
    }

    return new EnoValidationError(message, snippet, selection);
  },

  expectedSectionGotSections: (context, name, instructions) => {
    const expandedInstructions = expandInstructions(instructions);
    const lastInstruction = expandedInstructions[expandedInstructions.length - 1];

    const message = context.messages.validation.expectedSectionGotSections(name);
    const snippet = report(context, instructions, expandedInstructions);
    const selection = [
      [expandedInstructions[0].lineNumber, 0],
      [lastInstruction.lineNumber, lastInstruction.line.length]
    ];

    return new EnoValidationError(message, snippet, selection);
  },

  expectedSectionsGotDictionary: (context, instruction) => {
    const message = context.messages.validation.expectedSectionsGotDictionary(instruction.name);
    const snippet = report(context, [instruction, ...instruction.subinstructions]);
    const selection = [[instruction.lineNumber, 0]];

    if(instruction.subinstructions.length > 0) {
      const lastInstruction = instruction.subinstructions[instruction.subinstructions.length - 1];
      selection.push([lastInstruction.lineNumber, lastInstruction.line.length]);
    } else {
      selection.push([instruction.lineNumber, instruction.line.length]);
    }

    return new EnoValidationError(message, snippet, selection);
  },

  expectedSectionsGotEmpty: (context, instruction) => {
    const message = context.messages.validation.expectedSectionsGotEmpty(instruction.name);
    const snippet = report(context, [instruction, ...instruction.subinstructions]);
    const selection = [[instruction.lineNumber, 0]];

    if(instruction.subinstructions.length > 0) {
      const lastInstruction = instruction.subinstructions[instruction.subinstructions.length - 1];
      selection.push([lastInstruction.lineNumber, lastInstruction.line.length]);
    } else {
      selection.push([instruction.lineNumber, instruction.line.length]);
    }

    return new EnoValidationError(message, snippet, selection);
  },

  expectedSectionsGotField: (context, instruction) => {
    const message = context.messages.validation.expectedSectionsGotField(instruction.name);
    const snippet = report(context, [instruction, ...instruction.subinstructions]);
    const selection = [[instruction.lineNumber, 0]];

    if(instruction.subinstructions.length > 0) {
      const lastInstruction = instruction.subinstructions[instruction.subinstructions.length - 1];
      selection.push([lastInstruction.lineNumber, lastInstruction.line.length]);
    } else {
      selection.push([instruction.lineNumber, instruction.line.length]);
    }

    return new EnoValidationError(message, snippet, selection);
  },

  expectedSectionsGotList: (context, instruction) => {
    const message = context.messages.validation.expectedSectionsGotList(instruction.name);
    const snippet = report(context, [instruction, ...instruction.subinstructions]);
    const selection = [[instruction.lineNumber, 0]];

    if(instruction.subinstructions.length > 0) {
      const lastInstruction = instruction.subinstructions[instruction.subinstructions.length - 1];
      selection.push([lastInstruction.lineNumber, lastInstruction.line.length]);
    } else {
      selection.push([instruction.lineNumber, instruction.line.length]);
    }

    return new EnoValidationError(message, snippet, selection);
  },

  maxCountNotMet: (context, name, instructions, maxCount, sectionInstruction) => {
    const message = context.messages.validation.maxCountNotMet(
      name,
      instructions.count,
      maxCount
    );

    let selection;
    let snippet;
    if(instructions.length > 0) {
      selection = [[instructions[0].lineNumber, 0], [instructions[0].lineNumber, 0]];
      snippet = report(context, instructions);
    } else {
      if(sectionInstruction.lineNumber < context.instructions.length) {
        selection = [[sectionInstruction.lineNumber + 1, 0], [sectionInstruction.lineNumber + 1, 0]];
      } else {
        selection = [
          [sectionInstruction.lineNumber, sectionInstruction.line.length],
          [sectionInstruction.lineNumber, sectionInstruction.line.length]
        ];
      }
      snippet = report(context, sectionInstruction.subinstructions);
    }

    return new EnoValidationError(message, snippet, selection);
  },

  minCountNotMet: (context, name, instructions, minCount, sectionInstruction) => {
    const message = context.messages.validation.minCountNotMet(
      name,
      instructions.count,
      minCount
    );

    let selection;
    let snippet;
    if(instructions.length > 0) {
      selection = [[instructions[0].lineNumber, 0], [instructions[0].lineNumber, 0]];
      snippet = report(context, instructions);
    } else {
      if(sectionInstruction.lineNumber < context.instructions.length) {
        selection = [[sectionInstruction.lineNumber + 1, 0], [sectionInstruction.lineNumber + 1, 0]];
      } else {
        selection = [
          [sectionInstruction.lineNumber, sectionInstruction.line.length],
          [sectionInstruction.lineNumber, sectionInstruction.line.length]
        ];
      }
      snippet = report(context, sectionInstruction.subinstructions);
    }

    return new EnoValidationError(message, snippet, selection);
  },

  // TODO: Exclude sections within sections for all the missing* errors (except missingDictionaryEntry)

  missingDictionary: (context, name, sectionInstruction) => {
    const message = context.messages.validation.missingDictionary(name);
    const snippet = report(context, sectionInstruction, deepExpandInstruction(sectionInstruction));
    const selection = [
      [sectionInstruction.lineNumber, sectionInstruction.line.length],
      [sectionInstruction.lineNumber, sectionInstruction.line.length]
    ];

    return new EnoValidationError(message, snippet, selection);
  },

  missingDictionaryEntry: (context, name, dictionaryInstruction) => {
    const message = context.messages.validation.missingDictionaryEntry(name);
    const snippet = report(context, dictionaryInstruction, deepExpandInstruction(dictionaryInstruction));
    const selection = [
      [dictionaryInstruction.lineNumber, dictionaryInstruction.line.length],
      [dictionaryInstruction.lineNumber, dictionaryInstruction.line.length]
    ];

    return new EnoValidationError(message, snippet, selection);
  },

  missingField: (context, name, sectionInstruction) => {
    const message = context.messages.validation.missingField(name);
    const snippet = report(context, sectionInstruction, deepExpandInstruction(sectionInstruction));
    const selection = [
      [sectionInstruction.lineNumber, sectionInstruction.line.length],
      [sectionInstruction.lineNumber, sectionInstruction.line.length]
    ];

    return new EnoValidationError(message, snippet, selection);
  },

  missingList: (context, name, sectionInstruction) => {
    const message = context.messages.validation.missingList(name);
    const snippet = report(context, sectionInstruction, deepExpandInstruction(sectionInstruction));
    const selection = [
      [sectionInstruction.lineNumber, sectionInstruction.line.length],
      [sectionInstruction.lineNumber, sectionInstruction.line.length]
    ];

    return new EnoValidationError(message, snippet, selection);
  },

  missingSection: (context, name, sectionInstruction) => {
    const message = context.messages.validation.missingSection(name);
    const snippet = report(context, sectionInstruction, deepExpandInstruction(sectionInstruction));
    const selection = [
      [sectionInstruction.lineNumber, sectionInstruction.line.length],
      [sectionInstruction.lineNumber, sectionInstruction.line.length]
    ];

    return new EnoValidationError(message, snippet, selection);
  },

  valueError: (context, message, valueInstruction) => {
    if(message === undefined) {
      message = context.messages.validation.genericError(valueInstruction.name);
    }

    let snippet, selection;

    if(valueInstruction.type === 'BLOCK') {
      const contentInstructions = valueInstruction.subinstructions.filter(instruction => instruction.type === 'BLOCK_CONTENT');
      const terminatorInstruction = valueInstruction.subinstructions[valueInstruction.subinstructions.length -1];

      if(contentInstructions.length > 0) {
        const firstInstruction = contentInstructions[0];
        const lastInstruction = contentInstructions[contentInstructions.length - 1];

        snippet = report(context, contentInstructions);
        selection = [
          [firstInstruction.lineNumber, firstInstruction.ranges.content[0]],
          [lastInstruction.lineNumber, lastInstruction.ranges.content[1]]
        ];
      } else {
        snippet = report(context, [valueInstruction, terminatorInstruction]);
        selection = [
          [valueInstruction.lineNumber, valueInstruction.line.length],
          [valueInstruction.lineNumber, valueInstruction.line.length]
        ];
      }
    } else {
      snippet = report(context, valueInstruction);
      selection = [
        [valueInstruction.lineNumber, valueInstruction.ranges.value[0]],
        [valueInstruction.lineNumber, valueInstruction.ranges.value[1]]
      ];
    }

    return new EnoValidationError(message, snippet, selection);
  }

};
