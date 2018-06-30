const errors = require('../errors/analysis.js');

module.exports = context => {
  context.documentInstruction = {
    depth: 0,
    index: 0,
    length: 0,
    line: 1,
    name: '<>#:=|\\_ENO_DOCUMENT',
    ranges: {
      sectionOperator: [0, 0],
      name: [0, 0]
    },
    subinstructions: []
  };

  context.templateIndex = {};
  context.unresolvedInstructions = [];

  let lastDictionaryEntryNames = null;
  let lastNameInstruction = null;
  let lastSectionInstruction = context.documentInstruction;
  let activeSectionInstructions = [context.documentInstruction];
  let unresolvedIdleInstructions = [];

  for(let instruction of context.instructions) {

    if(instruction.type ===  'EMPTY_LINE' || instruction.type === 'COMMENT') {
      if(lastNameInstruction) {
        unresolvedIdleInstructions.push(instruction);
      } else {
        lastSectionInstruction.subinstructions.push(instruction);
      }

      continue;
    }

    if(instruction.type === 'BLOCK_CONTENT') {
      lastNameInstruction.subinstructions.push(instruction);
      continue;
    }

    if(instruction.type === 'FIELD') {
      lastSectionInstruction.subinstructions.push(...unresolvedIdleInstructions);
      unresolvedIdleInstructions = [];

      instruction.subinstructions = [];

      lastNameInstruction = instruction;

      if(context.templateIndex.hasOwnProperty(instruction.name)) {
        context.templateIndex[instruction.name].push(instruction);
      } else {
        context.templateIndex[instruction.name] = [instruction];
      }

      lastSectionInstruction.subinstructions.push(instruction);

      continue;
    }

    if(instruction.type === 'NAME') {
      lastSectionInstruction.subinstructions.push(...unresolvedIdleInstructions);
      unresolvedIdleInstructions = [];

      instruction.subinstructions = [];

      lastNameInstruction = instruction;

      if(instruction.template) {
        context.unresolvedInstructions.push(instruction);
      }

      if(instruction.name !== instruction.template) {
        if(context.templateIndex.hasOwnProperty(instruction.name)) {
          context.templateIndex[instruction.name].push(instruction);
        } else {
          context.templateIndex[instruction.name] = [instruction];
        }
      }

      lastSectionInstruction.subinstructions.push(instruction);

      continue;
    }

    if(instruction.type === 'LIST_ITEM') {
      if(lastNameInstruction === null) {
        throw errors.missingNameForListItem(context, instruction);
      }

      lastNameInstruction.subinstructions.push(...unresolvedIdleInstructions);
      unresolvedIdleInstructions = [];

      instruction.name = lastNameInstruction.name;

      if(lastNameInstruction.type === 'LIST') {
        lastNameInstruction.subinstructions.push(instruction);
        continue;
      }

      if(lastNameInstruction.type === 'NAME') {
        lastNameInstruction.type = 'LIST';
        lastNameInstruction.subinstructions.push(instruction);
        continue;
      }

      if(lastNameInstruction.type === 'DICTIONARY') {
        throw errors.listItemInDictionary(context, instruction, lastNameInstruction);
      }

      if(lastNameInstruction.type === 'FIELD') {
        throw errors.listItemInField(context, instruction, lastNameInstruction);
      }
    }

    if(instruction.type === 'DICTIONARY_ENTRY') {
      if(lastNameInstruction === null) {
        throw errors.missingNameForDictionaryEntry(context, instruction);
      }

      lastNameInstruction.subinstructions.push(...unresolvedIdleInstructions);
      unresolvedIdleInstructions = [];

      if(lastNameInstruction.type === 'DICTIONARY') {
        if(lastDictionaryEntryNames.has(instruction.name)) {
          throw errors.duplicateDictionaryEntryName(context, lastNameInstruction, instruction);
        } else {
          lastDictionaryEntryNames.add(instruction.name);
        }

        lastNameInstruction.subinstructions.push(instruction);
        continue;
      }

      if(lastNameInstruction.type === 'NAME') {
        lastNameInstruction.type = 'DICTIONARY';
        lastNameInstruction.subinstructions.push(instruction);
        lastDictionaryEntryNames = new Set([instruction.name]);
        continue;
      }

      if(lastNameInstruction.type === 'LIST') {
        throw errors.dictionaryEntryInList(context, instruction, lastNameInstruction);
      }

      if(lastNameInstruction.type === 'FIELD') {
        throw errors.dictionaryEntryInField(context, instruction, lastNameInstruction);
      }
    }

    if(instruction.type ===  'BLOCK') {
      lastSectionInstruction.subinstructions.push(...unresolvedIdleInstructions);
      unresolvedIdleInstructions = [];

      instruction.subinstructions = [];

      lastNameInstruction = instruction;

      if(context.templateIndex.hasOwnProperty(instruction.name)) {
        context.templateIndex[instruction.name].push(instruction);
      } else {
        context.templateIndex[instruction.name] = [instruction];
      }

      lastSectionInstruction.subinstructions.push(instruction);

      continue;
    }

    if(instruction.type ===  'BLOCK_TERMINATOR') {
      lastNameInstruction.subinstructions.push(instruction);
      lastNameInstruction = null;
      continue;
    }

    if(instruction.type === 'CONTINUATION') {
      if(lastNameInstruction === null) {
        throw errors.missingNameForFieldAppend(context, instruction);
      }

      lastNameInstruction.subinstructions.push(...unresolvedIdleInstructions);
      unresolvedIdleInstructions = [];

      if(lastNameInstruction.type === 'FIELD') {
        lastNameInstruction.subinstructions.push(instruction);
        continue;
      }

      if(lastNameInstruction.type === 'NAME') {
        lastNameInstruction.type = 'FIELD';
        lastNameInstruction.subinstructions.push(instruction);
        continue;
      }

      if(lastNameInstruction.type === 'DICTIONARY') {
        throw errors.fieldAppendInDictionary(context, instruction, lastNameInstruction);
      }

      if(lastNameInstruction.type === 'LIST') {
        throw errors.fieldAppendInList(context, instruction, lastNameInstruction);
      }
    }

    if(instruction.type === 'SECTION') {
      lastSectionInstruction.subinstructions.push(...unresolvedIdleInstructions);
      unresolvedIdleInstructions = [];

      if(instruction.depth - lastSectionInstruction.depth > 1) {
        throw errors.sectionHierarchyLayerSkip(context, instruction, lastSectionInstruction);
      }

      if(instruction.depth > lastSectionInstruction.depth) {
        lastSectionInstruction.subinstructions.push(instruction);
      } else {
        while(activeSectionInstructions[activeSectionInstructions.length - 1].depth >= instruction.depth) {
          activeSectionInstructions.pop();
        }

        activeSectionInstructions[activeSectionInstructions.length - 1].subinstructions.push(instruction);
      }

      lastNameInstruction = null;
      lastSectionInstruction = instruction;
      activeSectionInstructions.push(instruction);

      if(instruction.template) {
        context.unresolvedInstructions.push(instruction);
      }

      if(instruction.name !== instruction.template) {
        if(context.templateIndex.hasOwnProperty(instruction.name)) {
          context.templateIndex[instruction.name].push(instruction);
        } else {
          context.templateIndex[instruction.name] = [instruction];
        }
      }

      instruction.subinstructions = [];

      continue;
    }

  } // ends for(let instruction of context.instructions)

  if(unresolvedIdleInstructions.length > 0) {
    lastSectionInstruction.subinstructions.push(...unresolvedIdleInstructions);
    unresolvedIdleInstructions = [];
  }
}
