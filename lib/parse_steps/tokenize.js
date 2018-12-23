const errors = require('../errors/tokenization.js');
const matcher = require('../grammar_matcher.js');

// TODO: Make extraction of comments an optional flagged feature, by default its off to gain speed!

const tokenizeErrorContext = (context, index, line) => {
  let firstInstruction;

  while(true) {
    const endOfLineIndex = context.input.indexOf('\n', index);

    if(endOfLineIndex === -1) {
      const instruction = {
        index: index,
        length: context.input.length - index,
        line: line
      };

      context.instructions.push(instruction);

      if(!firstInstruction) {
        firstInstruction = instruction;
      }

      return firstInstruction;
    } else {
      const instruction = {
        index: index,
        length: endOfLineIndex - index,
        line: line
      };

      context.instructions.push(instruction);

      if(!firstInstruction) {
        firstInstruction = instruction;
      }

      index = endOfLineIndex + 1;
      line++;
    }
  }
};

module.exports = context => {
  context.instructions = [];

  let index = 0;
  let line = 0;
  let instruction = {};
  const matcherRegex = matcher.GRAMMAR_REGEXP;
  matcherRegex.lastIndex = index;

  while(true) {
    const match = matcherRegex.exec(context.input);

    if(match === null) {
      const instruction = tokenizeErrorContext(context, index, line);
      throw errors.invalidLine(context, instruction);
    }

    instruction = {
      index: index,
      line: line++
    };

    if(match[matcher.EMPTY_LINE_INDEX] !== undefined) {

      instruction.type = 'NOOP';

    } else if(match[matcher.NAME_OPERATOR_INDEX]) {


      const unescapedName = match[matcher.NAME_UNESCAPED_INDEX];
      let nameOperatorIndex;

      if(unescapedName) {
        instruction.name = unescapedName;

        const nameIndex = context.input.indexOf(instruction.name, index);
        nameOperatorIndex = context.input.indexOf(':', nameIndex + instruction.name.length);

        instruction.ranges = {
          nameOperator: [nameOperatorIndex - index, nameOperatorIndex - index + 1],
          name: [nameIndex - index, nameIndex - index + instruction.name.length]
        };
      } else {
        instruction.name = match[matcher.NAME_ESCAPED_INDEX];

        const escapeOperator = match[matcher.NAME_ESCAPE_BEGIN_OPERATOR_INDEX];
        const escapeBeginOperatorIndex = context.input.indexOf(escapeOperator, index);
        const nameIndex = context.input.indexOf(instruction.name, escapeBeginOperatorIndex + escapeOperator.length);
        const escapeEndOperatorIndex = context.input.indexOf(escapeOperator, nameIndex + instruction.name.length);
        nameOperatorIndex = context.input.indexOf(':', escapeEndOperatorIndex + escapeOperator.length);

        instruction.ranges = {
          escapeBeginOperator: [escapeBeginOperatorIndex - index, escapeBeginOperatorIndex - index + escapeOperator.length],
          escapeEndOperator: [escapeEndOperatorIndex - index, escapeEndOperatorIndex - index + escapeOperator.length],
          nameOperator: [nameOperatorIndex - index, nameOperatorIndex - index + 1],
          name: [nameIndex - index, nameIndex - index + instruction.name.length]
        };
      }

      const value = match[matcher.FIELD_VALUE_INDEX];
      if(value) {
        instruction.type = 'FIELD';
        instruction.value = value;

        const valueIndex = context.input.indexOf(value, nameOperatorIndex + 1);
        instruction.ranges.value = [valueIndex - index, valueIndex - index + value.length];
      } else {
        instruction.type = 'NAME';
      }


    } else if(match[matcher.LIST_ITEM_INDEX]) {


      instruction.type = 'LIST_ITEM';
      instruction.value = match[matcher.LIST_ITEM_VALUE_INDEX] || null;

      const operatorIndex = context.input.indexOf('-', index);
      instruction.ranges = { itemOperator: [operatorIndex - index, operatorIndex - index + 1] };

      if(instruction.value) {
        const valueIndex = context.input.indexOf(instruction.value, operatorIndex + 1);
        instruction.ranges.value = [valueIndex - index, valueIndex - index + instruction.value.length];
      }


    } else if(match[matcher.FIELDSET_ENTRY_OPERATOR_INDEX]) {


      const unescapedName = match[matcher.NAME_UNESCAPED_INDEX];
      let entryOperatorIndex;

      if(unescapedName) {
        instruction.name = unescapedName;

        const nameIndex = context.input.indexOf(instruction.name, index);
        entryOperatorIndex = context.input.indexOf('=', nameIndex + instruction.name.length);

        instruction.ranges = {
          entryOperator: [entryOperatorIndex - index, entryOperatorIndex - index + 1],
          name: [nameIndex - index, nameIndex - index + instruction.name.length]
        };
      } else {
        instruction.name = match[matcher.NAME_ESCAPED_INDEX];

        const escapeOperator = match[matcher.NAME_ESCAPE_BEGIN_OPERATOR_INDEX];
        const escapeBeginOperatorIndex = context.input.indexOf(escapeOperator, index);
        const nameIndex = context.input.indexOf(instruction.name, escapeBeginOperatorIndex + escapeOperator.length);
        const escapeEndOperatorIndex = context.input.indexOf(escapeOperator, nameIndex + instruction.name.length);
        entryOperatorIndex = context.input.indexOf('=', escapeEndOperatorIndex + escapeOperator.length);

        instruction.ranges = {
          escapeBeginOperator: [escapeBeginOperatorIndex - index, escapeBeginOperatorIndex - index + escapeOperator.length],
          escapeEndOperator: [escapeEndOperatorIndex - index, escapeEndOperatorIndex - index + escapeOperator.length],
          entryOperator: [entryOperatorIndex - index, entryOperatorIndex - index + 1],
          name: [nameIndex - index, nameIndex - index + instruction.name.length]
        };
      }

      instruction.type = 'FIELDSET_ENTRY';
      instruction.value = match[matcher.FIELDSET_ENTRY_VALUE_INDEX] || null;

      if(instruction.value) {
        const valueIndex = context.input.indexOf(instruction.value, entryOperatorIndex + 1);
        instruction.ranges.value = [valueIndex - index, valueIndex - index + instruction.value.length];
      }


    } else if(match[matcher.LINE_CONTINUATION_OPERATOR_INDEX]) {


      instruction.separator = ' ';
      instruction.type = 'CONTINUATION';
      instruction.value = match[matcher.LINE_CONTINUATION_VALUE_INDEX] || null;

      const operatorIndex = context.input.indexOf('\\', index);
      instruction.ranges = { lineContinuationOperator: [operatorIndex - index, operatorIndex - index + 1] };

      if(instruction.value) {
        const valueIndex = context.input.indexOf(instruction.value, operatorIndex + 1);
        instruction.ranges.value = [valueIndex - index, valueIndex - index + instruction.value.length];
      }


    } else if(match[matcher.NEWLINE_CONTINUATION_OPERATOR_INDEX]) {


      instruction.separator = '\n';
      instruction.type = 'CONTINUATION';
      instruction.value = match[matcher.NEWLINE_CONTINUATION_VALUE_INDEX] || null;

      const operatorIndex = context.input.indexOf('|', index);
      instruction.ranges = { newlineContinuationOperator: [operatorIndex - index, operatorIndex - index + 1] };

      if(instruction.value) {
        const valueIndex = context.input.indexOf(instruction.value, operatorIndex + 1);
        instruction.ranges.value = [valueIndex - index, valueIndex - index + instruction.value.length];
      }


    } else if(match[matcher.SECTION_HASHES_INDEX]) {


      const sectionOperator = match[matcher.SECTION_HASHES_INDEX];

      instruction.depth = sectionOperator.length;
      instruction.type = 'SECTION';

      const sectionOperatorIndex = context.input.indexOf(sectionOperator, index);
      const unescapedName = match[matcher.SECTION_NAME_UNESCAPED_INDEX];
      let nameEndIndex;

      if(unescapedName) {
        instruction.name = unescapedName;

        const nameIndex = context.input.indexOf(instruction.name, sectionOperatorIndex + sectionOperator.length);
        nameEndIndex = nameIndex + unescapedName.length;

        instruction.ranges = {
          name: [nameIndex - index, nameIndex - index + unescapedName.length],
          sectionOperator: [sectionOperatorIndex - index, sectionOperatorIndex - index + sectionOperator.length]
        };
      } else {
        instruction.name = match[matcher.SECTION_NAME_ESCAPED_INDEX];

        const escapeOperator = match[matcher.SECTION_NAME_ESCAPE_BEGIN_OPERATOR_INDEX];
        const escapeBeginOperatorIndex = context.input.indexOf(escapeOperator, sectionOperatorIndex + sectionOperator.length);
        const nameIndex = context.input.indexOf(instruction.name, escapeBeginOperatorIndex + escapeOperator.length);
        const escapeEndOperatorIndex = context.input.indexOf(escapeOperator, nameIndex + instruction.name.length);
        nameEndIndex = escapeEndOperatorIndex + escapeOperator.length;

        instruction.ranges = {
          escapeBeginOperator: [escapeBeginOperatorIndex - index, escapeBeginOperatorIndex - index + escapeOperator.length],
          escapeEndOperator: [escapeEndOperatorIndex - index, escapeEndOperatorIndex - index + escapeOperator.length],
          name: [nameIndex - index, nameIndex - index + instruction.name.length],
          sectionOperator: [sectionOperatorIndex - index, sectionOperatorIndex - index + sectionOperator.length]
        };
      }

      const template = match[matcher.SECTION_TEMPLATE_INDEX];
      if(template) {
        instruction.template = template;

        const copyOperator = match[matcher.SECTION_COPY_OPERATOR_INDEX];
        const copyOperatorIndex = context.input.indexOf(copyOperator, nameEndIndex);
        const templateIndex = context.input.indexOf(template, copyOperatorIndex + copyOperator.length);

        if(copyOperator === '<') {
          instruction.deepCopy = false;
          instruction.ranges.copyOperator = [copyOperatorIndex - index, copyOperatorIndex - index + copyOperator.length];
        } else { // copyOperator === '<<'
          instruction.deepCopy = true;
          instruction.ranges.deepCopyOperator = [copyOperatorIndex - index, copyOperatorIndex - index + copyOperator.length];
        }

        instruction.ranges.template = [templateIndex - index, templateIndex - index + template.length];
      }


    } else if(match[matcher.BLOCK_DASHES_INDEX]) {


      const blockDashes = match[matcher.BLOCK_DASHES_INDEX];
      instruction.name = match[matcher.BLOCK_NAME_INDEX];
      instruction.type = 'BLOCK';

      let operatorIndex = context.input.indexOf(blockDashes, index);
      let nameIndex = context.input.indexOf(instruction.name, operatorIndex + blockDashes.length);
      instruction.length = matcherRegex.lastIndex - index;
      instruction.ranges = {
        blockOperator: [operatorIndex - index, operatorIndex - index + blockDashes.length],
        name: [nameIndex - index, nameIndex - index + instruction.name.length]
      };

      index = matcherRegex.lastIndex + 1;

      context.instructions.push(instruction);

      const startOfBlockIndex = index;

      const nameEscaped = instruction.name.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
      const terminatorMatcher = new RegExp(`[^\\S\\n]*(${blockDashes})(?!-)[^\\S\\n]*(${nameEscaped})[^\\S\\n]*(?=\\n|$)`, 'y');

      while(true) {
        terminatorMatcher.lastIndex = index;
        let terminatorMatch = terminatorMatcher.exec(context.input);

        if(terminatorMatch) {
          if(line > instruction.line + 1) {
            instruction.contentRange = [startOfBlockIndex, index - 2];
          }

          operatorIndex = context.input.indexOf(blockDashes, index);
          nameIndex = context.input.indexOf(instruction.name, operatorIndex + blockDashes.length);

          instruction = {
            index: index,
            line: line,
            ranges: {
              blockOperator: [operatorIndex - index, operatorIndex - index + blockDashes.length],
              name: [nameIndex - index, nameIndex - index + instruction.name.length]
            },
            type: 'BLOCK_TERMINATOR'
          };

          line++;
          matcherRegex.lastIndex = terminatorMatcher.lastIndex;

          break;
        } else {
          const endofLineIndex = context.input.indexOf('\n', index);

          if(endofLineIndex === -1) {
            context.instructions.push({
              index: index,
              length: context.input.length - index,
              line: line
            });

            throw errors.unterminatedBlock(context, instruction);
          } else {
            context.instructions.push({
              index: index,
              length: endofLineIndex - index,
              line: line,
              ranges: { content: [0, endofLineIndex - index] },
              type: 'BLOCK_CONTENT'
            });

            index = endofLineIndex + 1;
            line++;
          }
        }
      }

    } else if(match[matcher.COPY_OPERATOR_INDEX]) {

      const copyOperator = match[matcher.COPY_OPERATOR_INDEX];
      const template = match[matcher.TEMPLATE_INDEX];
      const unescapedName = match[matcher.NAME_UNESCAPED_INDEX];
      let copyOperatorIndex;

      if(unescapedName) {
        instruction.name = unescapedName;

        const nameIndex = context.input.indexOf(instruction.name, index);
        copyOperatorIndex = context.input.indexOf(copyOperator, nameIndex + instruction.name.length);

        instruction.ranges = {
          copyOperator: [copyOperatorIndex - index, copyOperatorIndex - index + copyOperator.length],
          name: [nameIndex - index, nameIndex - index + instruction.name.length]
        };
      } else {
        instruction.name = match[matcher.NAME_ESCAPED_INDEX];

        const escapeOperator = match[matcher.NAME_ESCAPE_BEGIN_OPERATOR_INDEX];
        const escapeBeginOperatorIndex = context.input.indexOf(escapeOperator, index);
        const nameIndex = context.input.indexOf(instruction.name, escapeBeginOperatorIndex + escapeOperator.length);
        const escapeEndOperatorIndex = context.input.indexOf(escapeOperator, nameIndex + instruction.name.length);
        copyOperatorIndex = context.input.indexOf(copyOperator, escapeEndOperatorIndex + escapeOperator.length);

        instruction.ranges = {
          copyOperator: [copyOperatorIndex - index, copyOperatorIndex - index + copyOperator.length],
          escapeBeginOperator: [escapeBeginOperatorIndex - index, escapeBeginOperatorIndex - index + escapeOperator.length],
          escapeEndOperator: [escapeEndOperatorIndex - index, escapeEndOperatorIndex - index + escapeOperator.length],
          name: [nameIndex - index, nameIndex - index + instruction.name.length]
        };
      }

      instruction.template = template;
      instruction.type = 'NAME';

      const templateIndex = context.input.indexOf(template, copyOperatorIndex + 1);
      instruction.ranges.template = [templateIndex - index, templateIndex - index + template.length];

    } else if(match[matcher.COMMENT_OPERATOR_INDEX]) {

      instruction.type = 'NOOP';

      const operatorIndex = context.input.indexOf('>', index);
      instruction.ranges = { commentOperator: [operatorIndex - index, operatorIndex - index + 1] };

      instruction.comment = match[matcher.COMMENT_TEXT_INDEX] || null;

      if(instruction.comment) {
        const commentIndex = context.input.indexOf(instruction.comment, operatorIndex + 1);
        instruction.ranges.comment = [commentIndex - index, commentIndex - index + instruction.comment.length];
      }

    }

    instruction.length = matcherRegex.lastIndex - index;
    index = matcherRegex.lastIndex + 1;
    matcherRegex.lastIndex += 1;

    context.instructions.push(instruction);

    if(index >= context.input.length) {
      // TODO: Possibly solve this by capturing with the unified grammar matcher as last group
      if(context.input[context.input.length - 1] === '\n') {
        context.instructions.push({
          index: context.input.length,
          length: 0,
          line: line,
          type: 'NOOP'
        });
      }

      break;
    }
  } // ends while(true)
};
