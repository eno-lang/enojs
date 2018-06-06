const { EnoParseError } = require('../errors.js');
const report = require('../reporters/report.js');

module.exports = {

  dictionaryEntryInField: (context, entryInstruction, fieldInstruction) => {
    const message = context.messages.analysis.dictionaryEntryInField(entryInstruction.lineNumber);
    const snippet = report(
      context,
      entryInstruction,
      [fieldInstruction, ...fieldInstruction.subinstructions]
    );
    const selection = [
      [entryInstruction.lineNumber, 0],
      [entryInstruction.lineNumber, entryInstruction.line.length]
    ];

    return new EnoParseError(message, snippet, selection);
  },

  dictionaryEntryInList: (context, entryInstruction, listInstruction) => {
    const message = context.messages.analysis.dictionaryEntryInList(entryInstruction.lineNumber);
    const snippet = report(
      context,
      entryInstruction,
      [listInstruction, ...listInstruction.subinstructions]
    );
    const selection = [
      [entryInstruction.lineNumber, 0],
      [entryInstruction.lineNumber, entryInstruction.line.length]
    ];

    return new EnoParseError(message, snippet, selection);
  },

  duplicateDictionaryEntryName: (context, dictionaryInstruction, entryInstruction) => {
    const message = context.messages.analysis.duplicateDictionaryEntryName(
      dictionaryInstruction.name,
      entryInstruction.name
    );
    const snippet = report(
      context,
      [entryInstruction, dictionaryInstruction.subinstructions.find(instruction => instruction.name === entryInstruction.name)],
      [dictionaryInstruction, ...dictionaryInstruction.subinstructions]
    );
    const selection = [
      [entryInstruction.lineNumber, 0],
      [entryInstruction.lineNumber, entryInstruction.line.length]
    ];

    return new EnoParseError(message, snippet, selection);
  },

  fieldAppendInDictionary: (context, appendInstruction, dictionaryInstruction) => {
    const message = context.messages.analysis.fieldAppendInDictionary(appendInstruction.lineNumber);
    const snippet = report(
      context,
      appendInstruction,
      [dictionaryInstruction, ...dictionaryInstruction.subinstructions]
    );
    const selection = [
      [appendInstruction.lineNumber, 0],
      [appendInstruction.lineNumber, appendInstruction.line.length]
    ];

    return new EnoParseError(message, snippet, selection);
  },

  fieldAppendInList: (context, appendInstruction, listInstruction) => {
    const message = context.messages.analysis.fieldAppendInList(appendInstruction.lineNumber);
    const snippet = report(
      context,
      appendInstruction,
      [listInstruction, ...listInstruction.subinstructions]
    );
    const selection = [
      [appendInstruction.lineNumber, 0],
      [appendInstruction.lineNumber, appendInstruction.line.length]
    ];

    return new EnoParseError(message, snippet, selection);
  },

  listItemInField: (context, itemInstruction, fieldInstruction) => {
    const message = context.messages.analysis.listItemInField(itemInstruction.lineNumber);
    const snippet = report(
      context,
      itemInstruction,
      [fieldInstruction, ...fieldInstruction.subinstructions]
    );
    const selection = [
      [itemInstruction.lineNumber, 0],
      [itemInstruction.lineNumber, itemInstruction.line.length]
    ];

    return new EnoParseError(message, snippet, selection);
  },

  listItemInDictionary: (context, itemInstruction, dictionaryInstruction) => {
    const message = context.messages.analysis.listItemInDictionary(itemInstruction.lineNumber);
    const snippet = report(
      context,
      itemInstruction,
      [dictionaryInstruction, ...dictionaryInstruction.subinstructions]
    );
    const selection = [
      [itemInstruction.lineNumber, 0],
      [itemInstruction.lineNumber, itemInstruction.line.length]
    ];

    return new EnoParseError(message, snippet, selection);
  },

  missingNameForDictionaryEntry: (context, instruction) => {
    const message = context.messages.analysis.missingNameForDictionaryEntry(instruction.lineNumber);
    const snippet = report(context, instruction);
    const selection = [
      [instruction.lineNumber, 0],
      [instruction.lineNumber, instruction.line.length]
    ];

    return new EnoParseError(message, snippet, selection);
  },

  missingNameForFieldAppend: (context, instruction) => {
    const message = context.messages.analysis.missingNameForFieldAppend(instruction.lineNumber);
    const snippet = report(context, instruction);
    const selection = [
      [instruction.lineNumber, 0],
      [instruction.lineNumber, instruction.line.length]
    ];

    return new EnoParseError(message, snippet, selection);
  },

  missingNameForListItem: (context, instruction) => {
    const message = context.messages.analysis.missingNameForListItem(instruction.lineNumber);
    const snippet = report(context, instruction);
    const selection = [
      [instruction.lineNumber, 0],
      [instruction.lineNumber, instruction.line.length]
    ];

    return new EnoParseError(message, snippet, selection);
  },

  sectionHierarchyLayerSkip: (context, subSectionInstruction, superSectionInstruction) => {
    const message = context.messages.analysis.sectionHierarchyLayerSkip(subSectionInstruction.lineNumber);
    const snippet = report(context, subSectionInstruction, superSectionInstruction);
    const selection = [
      [subSectionInstruction.lineNumber, 0],
      [subSectionInstruction.lineNumber, subSectionInstruction.line.length]
    ];

    return new EnoParseError(message, snippet, selection);
  }

};
