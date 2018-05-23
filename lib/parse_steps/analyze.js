const errors = require('../errors/analysis.js');

module.exports = context => {
  context.documentInstruction = {
    depth: 0,
    lineNumber: 1,
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
  let unassignedIdleInstructions = [];

  for(let instruction of context.instructions) {

    if(instruction.type ===  'EMPTY' || instruction.type === 'COMMENT') {
      if(lastNameInstruction) {
        unassignedIdleInstructions.push(instruction);
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
      lastSectionInstruction.subinstructions.push(...unassignedIdleInstructions);
      unassignedIdleInstructions = [];

      instruction.subinstructions = [];

      lastNameInstruction = instruction;

      const existingTemplates = context.templateIndex[instruction.name];
      if(existingTemplates) {
        existingTemplates.push(instruction);
      } else {
        context.templateIndex[instruction.name] = [instruction];
      }

      lastSectionInstruction.subinstructions.push(instruction);

      continue;
    }

    if(instruction.type === 'NAME') {
      lastSectionInstruction.subinstructions.push(...unassignedIdleInstructions);
      unassignedIdleInstructions = [];

      instruction.subinstructions = [];

      lastNameInstruction = instruction;

      if(instruction.template) {
        context.unresolvedInstructions.push(instruction);
      }

      if(instruction.name !== instruction.template) {
        const existingTemplates = context.templateIndex[instruction.name];

        if(existingTemplates) {
          existingTemplates.push(instruction);
        } else {
          context.templateIndex[instruction.name] = [instruction];
        }
      }

      lastSectionInstruction.subinstructions.push(instruction);

      continue;
    }

    if(instruction.type === 'LIST_ITEM') {
      if(lastNameInstruction === null) {
        errors.missingNameForListItem(context, instruction);
      }

      lastNameInstruction.subinstructions.push(...unassignedIdleInstructions);
      unassignedIdleInstructions = [];

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
        errors.listItemInDictionary(context, instruction, lastNameInstruction);
      }

      if(lastNameInstruction.type === 'FIELD') {
        errors.listItemInField(context, instruction, lastNameInstruction);
      }
    }

    if(instruction.type === 'DICTIONARY_ENTRY') {
      if(lastNameInstruction === null) {
        errors.missingNameForDictionaryEntry(context, instruction);
      }

      lastNameInstruction.subinstructions.push(...unassignedIdleInstructions);
      unassignedIdleInstructions = [];

      if(lastNameInstruction.type === 'DICTIONARY') {
        if(lastDictionaryEntryNames.has(instruction.name)) {
          errors.duplicateDictionaryEntryName(context, lastNameInstruction, instruction);
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
        errors.dictionaryEntryInList(context, instruction, lastNameInstruction);
      }

      if(lastNameInstruction.type === 'FIELD') {
        errors.dictionaryEntryInField(context, instruction, lastNameInstruction);
      }
    }

    if(instruction.type ===  'BLOCK') {
      lastSectionInstruction.subinstructions.push(...unassignedIdleInstructions);
      unassignedIdleInstructions = [];

      instruction.subinstructions = [];

      lastNameInstruction = instruction;

      const existingTemplates = context.templateIndex[instruction.name];
      if(existingTemplates) {
        existingTemplates.push(instruction);
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

    if(instruction.type === 'FIELD_APPEND') {
      if(lastNameInstruction === null) {
        errors.missingNameForFieldAppend(context, instruction);
      }

      lastNameInstruction.subinstructions.push(...unassignedIdleInstructions);
      unassignedIdleInstructions = [];

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
        errors.fieldAppendInDictionary(context, instruction, lastNameInstruction);
      }

      if(lastNameInstruction.type === 'LIST') {
        errors.fieldAppendInList(context, instruction, lastNameInstruction);
      }
    }

    if(instruction.type === 'SECTION') {
      lastSectionInstruction.subinstructions.push(...unassignedIdleInstructions);
      unassignedIdleInstructions = [];

      if(instruction.depth - lastSectionInstruction.depth > 1) {
        errors.sectionHierarchyLayerSkip(context, instruction, lastSectionInstruction);
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
        const existingTemplates = context.templateIndex[instruction.name];

        if(existingTemplates) {
          existingTemplates.push(instruction);
        } else {
          context.templateIndex[instruction.name] = [instruction];
        }
      }

      instruction.subinstructions = [];

      continue;
    }

  } // ends for(let instruction of context.instructions)

  if(unassignedIdleInstructions.length > 0) {
    lastSectionInstruction.subinstructions.push(...unassignedIdleInstructions);
    unassignedIdleInstructions = [];
  }
}
