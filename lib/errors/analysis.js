const { ParseError } = require('../error_types.js');

module.exports = {

  fieldsetEntryInField: (context, entryInstruction, fieldInstruction) => {
    const message = context.messages.analysis.fieldsetEntryInField(
      entryInstruction.line + context.indexing
    );

    const snippet = context.reporter.report(
      context,
      entryInstruction,
      [fieldInstruction, ...fieldInstruction.subinstructions]
    );

    const selection = [
      [entryInstruction.line, 0],
      [entryInstruction.line, entryInstruction.length]
    ];

    return new ParseError(message, snippet, selection);
  },

  fieldsetEntryInList: (context, entryInstruction, listInstruction) => {
    const message = context.messages.analysis.fieldsetEntryInList(
      entryInstruction.line + context.indexing
    );

    const snippet = context.reporter.report(
      context,
      entryInstruction,
      [listInstruction, ...listInstruction.subinstructions]
    );

    const selection = [
      [entryInstruction.line, 0],
      [entryInstruction.line, entryInstruction.length]
    ];

    return new ParseError(message, snippet, selection);
  },

  duplicateFieldsetEntryName: (context, fieldsetInstruction, entryInstruction) => {
    const previousEntryInstruction = fieldsetInstruction.subinstructions.find(instruction =>
      instruction.name === entryInstruction.name
    );

    const message = context.messages.analysis.duplicateFieldsetEntryName(
      fieldsetInstruction.name,
      entryInstruction.name
    );

    const snippet = context.reporter.report(
      context,
      [entryInstruction, previousEntryInstruction],
      [fieldsetInstruction, ...fieldsetInstruction.subinstructions]
    );

    const selection = [
      [entryInstruction.line, 0],
      [entryInstruction.line, entryInstruction.length]
    ];

    return new ParseError(message, snippet, selection);
  },

  listItemInField: (context, itemInstruction, fieldInstruction) => {
    const message = context.messages.analysis.listItemInField(
      itemInstruction.line + context.indexing
    );

    const snippet = context.reporter.report(
      context,
      itemInstruction,
      [fieldInstruction, ...fieldInstruction.subinstructions]
    );

    const selection = [
      [itemInstruction.line, 0],
      [itemInstruction.line, itemInstruction.length]
    ];

    return new ParseError(message, snippet, selection);
  },

  listItemInFieldset: (context, itemInstruction, fieldsetInstruction) => {
    const message = context.messages.analysis.listItemInFieldset(
      itemInstruction.line + context.indexing
    );

    const snippet = context.reporter.report(
      context,
      itemInstruction,
      [fieldsetInstruction, ...fieldsetInstruction.subinstructions]
    );

    const selection = [
      [itemInstruction.line, 0],
      [itemInstruction.line, itemInstruction.length]
    ];

    return new ParseError(message, snippet, selection);
  },

  missingElementForContinuation: (context, instruction) => {
    const message = context.messages.analysis.missingElementForContinuation(
      instruction.line + context.indexing
    );

    const snippet = context.reporter.report(context, instruction);

    const selection = [
      [instruction.line, 0],
      [instruction.line, instruction.length]
    ];

    return new ParseError(message, snippet, selection);
  },

  missingNameForFieldsetEntry: (context, instruction) => {
    const message = context.messages.analysis.missingNameForFieldsetEntry(
      instruction.line + context.indexing
    );

    const snippet = context.reporter.report(context, instruction);

    const selection = [
      [instruction.line, 0],
      [instruction.line, instruction.length]
    ];

    return new ParseError(message, snippet, selection);
  },

  missingNameForListItem: (context, instruction) => {
    const message = context.messages.analysis.missingNameForListItem(
      instruction.line + context.indexing
    );

    const snippet = context.reporter.report(context, instruction);

    const selection = [
      [instruction.line, 0],
      [instruction.line, instruction.length]
    ];

    return new ParseError(message, snippet, selection);
  },

  sectionHierarchyLayerSkip: (context, sectionInstruction, superSectionInstruction) => {
    const message = context.messages.analysis.sectionHierarchyLayerSkip(
      sectionInstruction.line + context.indexing
    );

    const snippet = context.reporter.report(context, sectionInstruction, superSectionInstruction);

    const selection = [
      [sectionInstruction.line, 0],
      [sectionInstruction.line, sectionInstruction.length]
    ];

    return new ParseError(message, snippet, selection);
  }
};
