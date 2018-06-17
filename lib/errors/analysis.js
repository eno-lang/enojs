const { EnoParseError } = require('../errors.js');
const report = require('../reporters/report.js');

module.exports = {

  dictionaryEntryInField: (context, entryInstruction, fieldInstruction) => {
    const message = context.messages.analysis.dictionaryEntryInField(
      entryInstruction.lineNumber + context.indexing
    );

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
    const message = context.messages.analysis.dictionaryEntryInList(
      entryInstruction.lineNumber + context.indexing
    );

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
    const previousEntryInstruction = dictionaryInstruction.subinstructions.find(instruction =>
      instruction.name === entryInstruction.name
    );

    const message = context.messages.analysis.duplicateDictionaryEntryName(
      dictionaryInstruction.name,
      entryInstruction.name
    );

    const snippet = report(
      context,
      [entryInstruction, previousEntryInstruction],
      [dictionaryInstruction, ...dictionaryInstruction.subinstructions]
    );

    const selection = [
      [entryInstruction.lineNumber, 0],
      [entryInstruction.lineNumber, entryInstruction.line.length]
    ];

    return new EnoParseError(message, snippet, selection);
  },

  fieldAppendInDictionary: (context, appendInstruction, dictionaryInstruction) => {
    const message = context.messages.analysis.fieldAppendInDictionary(
      appendInstruction.lineNumber + context.indexing
    );

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
    const message = context.messages.analysis.fieldAppendInList(
      appendInstruction.lineNumber + context.indexing
    );

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
    const message = context.messages.analysis.listItemInField(
      itemInstruction.lineNumber + context.indexing
    );

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
    const message = context.messages.analysis.listItemInDictionary(
      itemInstruction.lineNumber + context.indexing
    );

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
    const message = context.messages.analysis.missingNameForDictionaryEntry(
      instruction.lineNumber + context.indexing
    );

    const snippet = report(context, instruction);

    const selection = [
      [instruction.lineNumber, 0],
      [instruction.lineNumber, instruction.line.length]
    ];

    return new EnoParseError(message, snippet, selection);
  },

  missingNameForFieldAppend: (context, instruction) => {
    const message = context.messages.analysis.missingNameForFieldAppend(
      instruction.lineNumber + context.indexing
    );

    const snippet = report(context, instruction);

    const selection = [
      [instruction.lineNumber, 0],
      [instruction.lineNumber, instruction.line.length]
    ];

    return new EnoParseError(message, snippet, selection);
  },

  missingNameForListItem: (context, instruction) => {
    const message = context.messages.analysis.missingNameForListItem(
      instruction.lineNumber + context.indexing
    );

    const snippet = report(context, instruction);

    const selection = [
      [instruction.lineNumber, 0],
      [instruction.lineNumber, instruction.line.length]
    ];

    return new EnoParseError(message, snippet, selection);
  },

  sectionHierarchyLayerSkip: (context, sectionInstruction, superSectionInstruction) => {
    const message = context.messages.analysis.sectionHierarchyLayerSkip(
      sectionInstruction.lineNumber + context.indexing
    );

    const snippet = report(context, sectionInstruction, superSectionInstruction);

    const selection = [
      [sectionInstruction.lineNumber, 0],
      [sectionInstruction.lineNumber, sectionInstruction.line.length]
    ];

    return new EnoParseError(message, snippet, selection);
  }
};
