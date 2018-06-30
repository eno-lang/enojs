const { EnoParseError } = require('../error_types.js');
const report = require('../reporters/report.js');

// TODO: Investigate the following:
//
// # original
// copy < original
//
// ... yields a 'copy into self' error, can we somehow change the error checking order
//     to have it generate a 'copy section into empty element' error instead?
//     (behaviour right now feels incorrect, although it's somewhat of a grey area)

module.exports = {

  copyingBlockIntoDictionary: (context, instruction) => {
    const message = context.messages.resolution.copyingBlockIntoDictionary(
      instruction.line + context.indexing
    );

    const snippet = report(context, instruction);

    const selection = [
      [instruction.line, 0],
      [instruction.line, instruction.length]
    ];

    return new EnoParseError(message, snippet, selection);
  },

  copyingBlockIntoList: (context, instruction) => {
    const message = context.messages.resolution.copyingBlockIntoList(
      instruction.line + context.indexing
    );

    const snippet = report(context, instruction);

    const selection = [
      [instruction.line, 0],
      [instruction.line, instruction.length]
    ];

    return new EnoParseError(message, snippet, selection);
  },

  copyingBlockIntoSection: (context, instruction) => {
    const message = context.messages.resolution.copyingBlockIntoSection(
      instruction.line + context.indexing
    );

    const snippet = report(context, instruction);

    const selection = [
      [instruction.line, 0],
      [instruction.line, instruction.length]
    ];

    return new EnoParseError(message, snippet, selection);
  },

  copyingDictionaryIntoField: (context, instruction) => {
    const message = context.messages.resolution.copyingDictionaryIntoField(
      instruction.line + context.indexing
    );

    const snippet = report(context, instruction);

    const selection = [
      [instruction.line, 0],
      [instruction.line, instruction.length]
    ];

    return new EnoParseError(message, snippet, selection);
  },

  copyingDictionaryIntoList: (context, instruction) => {
    const message = context.messages.resolution.copyingDictionaryIntoList(
      instruction.line + context.indexing
    );

    const snippet = report(context, instruction);

    const selection = [
      [instruction.line, 0],
      [instruction.line, instruction.length]
    ];

    return new EnoParseError(message, snippet, selection);
  },

  copyingDictionaryIntoSection: (context, instruction) => {
    const message = context.messages.resolution.copyingDictionaryIntoSection(
      instruction.line + context.indexing
    );

    const snippet = report(context, instruction);

    const selection = [
      [instruction.line, 0],
      [instruction.line, instruction.length]
    ];

    return new EnoParseError(message, snippet, selection);
  },

  copyingFieldIntoDictionary: (context, instruction) => {
    const message = context.messages.resolution.copyingFieldIntoDictionary(
      instruction.line + context.indexing
    );

    const snippet = report(context, instruction);

    const selection = [
      [instruction.line, 0],
      [instruction.line, instruction.length]
    ];

    return new EnoParseError(message, snippet, selection);
  },

  copyingFieldIntoList: (context, instruction) => {
    const message = context.messages.resolution.copyingFieldIntoList(
      instruction.line + context.indexing
    );

    const snippet = report(context, instruction);

    const selection = [
      [instruction.line, 0],
      [instruction.line, instruction.length]
    ];

    return new EnoParseError(message, snippet, selection);
  },

  copyingFieldIntoSection: (context, instruction) => {
    const message = context.messages.resolution.copyingFieldIntoSection(
      instruction.line + context.indexing
    );

    const snippet = report(context, instruction);

    const selection = [
      [instruction.line, 0],
      [instruction.line, instruction.length]
    ];

    return new EnoParseError(message, snippet, selection);
  },

  copyingListIntoDictionary: (context, instruction) => {
    const message = context.messages.resolution.copyingListIntoDictionary(
      instruction.line + context.indexing
    );

    const snippet = report(context, instruction);

    const selection = [
      [instruction.line, 0],
      [instruction.line, instruction.length]
    ];

    return new EnoParseError(message, snippet, selection);
  },

  copyingListIntoField: (context, instruction) => {
    const message = context.messages.resolution.copyingListIntoField(
      instruction.line + context.indexing
    );

    const snippet = report(context, instruction);

    const selection = [
      [instruction.line, 0],
      [instruction.line, instruction.length]
    ];

    return new EnoParseError(message, snippet, selection);
  },

  copyingListIntoSection: (context, instruction) => {
    const message = context.messages.resolution.copyingListIntoSection(
      instruction.line + context.indexing
    );

    const snippet = report(context, instruction);

    const selection = [
      [instruction.line, 0],
      [instruction.line, instruction.length]
    ];

    return new EnoParseError(message, snippet, selection);
  },

  copyingSectionIntoDictionary: (context, instruction) => {
    const message = context.messages.resolution.copyingSectionIntoDictionary(
      instruction.line + context.indexing
    );

    const snippet = report(context, instruction);

    const selection = [
      [instruction.line, 0],
      [instruction.line, instruction.length]
    ];

    return new EnoParseError(message, snippet, selection);
  },

  copyingSectionIntoField: (context, instruction) => {
    const message = context.messages.resolution.copyingSectionIntoField(
      instruction.line + context.indexing
    );

    const snippet = report(context, instruction);

    const selection = [
      [instruction.line, 0],
      [instruction.line, instruction.length]
    ];

    return new EnoParseError(message, snippet, selection);
  },

  copyingSectionIntoList: (context, instruction) => {
    const message = context.messages.resolution.copyingSectionIntoList(
      instruction.line + context.indexing
    );

    const snippet = report(context, instruction);

    const selection = [
      [instruction.line, 0],
      [instruction.line, instruction.length]
    ];

    return new EnoParseError(message, snippet, selection);
  },

  copyingSectionIntoEmpty: (context, instruction) => {
    const message = context.messages.resolution.copyingSectionIntoEmpty(
      instruction.line + context.indexing
    );

    const snippet = report(context, instruction);

    const selection = [
      [instruction.line, 0],
      [instruction.line, instruction.length]
    ];

    return new EnoParseError(message, snippet, selection);
  },

  cyclicDependency: (context, instruction, instructionChain) => {
    const firstOccurrence = instructionChain.indexOf(instruction);
    const feedbackChain = instructionChain.slice(firstOccurrence);
    const firstInstruction = feedbackChain[0];
    const lastInstruction = feedbackChain[feedbackChain.length - 1];

    let copyInstruction;
    if(lastInstruction.template) {
      copyInstruction = lastInstruction;
    } else if(firstInstruction.template) {
      copyInstruction = firstInstruction;
    }

    const message = context.messages.resolution.cyclicDependency(
      copyInstruction.line + context.indexing,
      copyInstruction.template
    );

    const snippet = report(
      context,
      copyInstruction,
      feedbackChain.filter(instruction => instruction !== copyInstruction)
    );

    const selection = [
      [copyInstruction.line, copyInstruction.ranges.template[0]],
      [copyInstruction.line, copyInstruction.ranges.template[1]]
    ];

    return new EnoParseError(message, snippet, selection);
  },

  multipleTemplatesFound: (context, instruction, templates) => {
    const message = context.messages.resolution.multipleTemplatesFound(
      instruction.line + context.indexing,
      instruction.template
    );

    const snippet = report(context, [instruction, ...templates]);

    const selection = [
      [instruction.line, 0],
      [instruction.line, instruction.length]
    ];

    return new EnoParseError(message, snippet, selection);
  },

  templateNotFound: (context, instruction) => {
    const message = context.messages.resolution.templateNotFound(
      instruction.line + context.indexing,
      instruction.template
    );
    const snippet = report(context, instruction);
    const selection = [
      [instruction.line, 0],
      [instruction.line, instruction.length]
    ];

    return new EnoParseError(message, snippet, selection);
  }

};
