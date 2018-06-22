const errors = require('../errors/tokenization.js');
const matcher = require('../grammar_matcher.js');

// TODO: Consider a reimplementation as a regex-free char-by-char tokenizer? (low priority though, more for speed and possibly cleanup of verbose column calculation code in here)

module.exports = context => {
  let expectedBlockTerminator = null;
  let unterminatedBlock = null;

  for(let instruction of context.instructions) {

    if(unterminatedBlock) {
      const match = expectedBlockTerminator.exec(instruction.line);

      if(match) {
        instruction.name = match[2];
        instruction.type = 'BLOCK_TERMINATOR';

        const dashes = match[1];
        const operatorColumn = instruction.line.indexOf(dashes);
        const nameColumn = instruction.line.lastIndexOf(instruction.name);

        instruction.ranges = {
          blockOperator: [operatorColumn, operatorColumn + dashes.length],
          name: [nameColumn, nameColumn + instruction.name.length]
        };

        expectedBlockTerminator = null;
        unterminatedBlock = null;

        continue;
      }

      instruction.ranges = { content: [0, instruction.line.length] };
      instruction.type = 'BLOCK_CONTENT';

      continue;
    }

    const match = matcher.GRAMMAR_REGEXP.exec(instruction.line);

    if(match) {

      if(match[matcher.EMPTY_LINE_INDEX] !== undefined) {
        instruction.type = 'EMPTY_LINE';
        continue;
      }


      if(match[matcher.COMMENT_ANGLE_INDEX]) {
        instruction.type = 'COMMENT';

        const operatorColumn = instruction.line.indexOf('>');
        instruction.ranges = { commentOperator: [operatorColumn, operatorColumn + 1] };

        instruction.text = match[matcher.COMMENT_TEXT_INDEX] || null;

        if(instruction.text) {
          const textColumn = instruction.line.lastIndexOf(instruction.text);
          instruction.ranges.comment = [textColumn, textColumn + instruction.text.length];
        }

        continue;
      }


      if(match[matcher.NAME_OPERATOR_INDEX]) {
        const unescapedName = match[matcher.NAME_UNESCAPED_INDEX];
        let nameOperatorColumn;

        if(unescapedName) {
          instruction.name = unescapedName;

          const nameColumn = instruction.line.indexOf(instruction.name);
          nameOperatorColumn = instruction.line.indexOf(':', nameColumn + instruction.name.length);

          instruction.ranges = {
            nameOperator: [nameOperatorColumn, nameOperatorColumn + 1],
            name: [nameColumn, nameColumn + instruction.name.length]
          };
        } else {
          instruction.name = match[matcher.NAME_ESCAPED_INDEX];

          const escapeOperator = match[matcher.NAME_ESCAPED_QUOTES_INDEX];
          const escapeBeginOperatorColumn = instruction.line.indexOf(escapeOperator);
          const nameColumn = instruction.line.indexOf(instruction.name, escapeBeginOperatorColumn + escapeOperator.length);
          const escapeEndOperatorColumn = instruction.line.indexOf(escapeOperator, nameColumn + instruction.name.length);
          nameOperatorColumn = instruction.line.indexOf(':', escapeEndOperatorColumn + escapeOperator.length);

          instruction.ranges = {
            escapeBeginOperator: [escapeBeginOperatorColumn, escapeBeginOperatorColumn, + escapeOperator.length],
            escapeEndOperator: [escapeEndOperatorColumn, escapeEndOperatorColumn, + escapeOperator.length],
            nameOperator: [nameOperatorColumn, nameOperatorColumn + 1],
            name: [nameColumn, nameColumn + instruction.name.length]
          };
        }

        const value = match[matcher.FIELD_VALUE_INDEX];
        if(value) {
          instruction.type = 'FIELD';
          instruction.value = value;

          const valueColumn = instruction.line.lastIndexOf(value);
          instruction.ranges.value = [valueColumn, valueColumn + value.length];
        } else {
          instruction.type = 'NAME';
        }

        continue;
      }


      if(match[matcher.LIST_ITEM_INDEX]) {
        instruction.type = 'LIST_ITEM';
        instruction.value = match[matcher.LIST_ITEM_VALUE_INDEX] || null;

        const operatorColumn = instruction.line.indexOf('-');
        instruction.ranges = { itemOperator: [operatorColumn, operatorColumn + 1] };

        if(instruction.value) {
          const valueColumn = instruction.line.lastIndexOf(instruction.value);
          instruction.ranges.value = [valueColumn, valueColumn + instruction.value.length];
        }

        continue;
      }


      if(match[matcher.DICTIONARY_ENTRY_EQUALS_INDEX]) {
        const unescapedName = match[matcher.NAME_UNESCAPED_INDEX];
        let entryOperatorColumn;

        if(unescapedName) {
          instruction.name = unescapedName;

          const nameColumn = instruction.line.indexOf(instruction.name);
          entryOperatorColumn = instruction.line.indexOf('=', nameColumn + instruction.name.length);

          instruction.ranges = {
            entryOperator: [entryOperatorColumn, entryOperatorColumn + 1],
            name: [nameColumn, nameColumn + instruction.name.length]
          };
        } else {
          instruction.name = match[matcher.NAME_ESCAPED_INDEX];

          const escapeOperator = match[matcher.NAME_ESCAPED_QUOTES_INDEX];
          const escapeBeginOperatorColumn = instruction.line.indexOf(escapeOperator);
          const nameColumn = instruction.line.indexOf(instruction.name, escapeBeginOperatorColumn + escapeOperator.length);
          const escapeEndOperatorColumn = instruction.line.indexOf(escapeOperator, nameColumn + instruction.name.length);
          entryOperatorColumn = instruction.line.indexOf('=', escapeEndOperatorColumn + escapeOperator.length);

          instruction.ranges = {
            escapeBeginOperator: [escapeBeginOperatorColumn, escapeBeginOperatorColumn, + escapeOperator.length],
            escapeEndOperator: [escapeEndOperatorColumn, escapeEndOperatorColumn, + escapeOperator.length],
            entryOperator: [entryOperatorColumn, entryOperatorColumn + 1],
            name: [nameColumn, nameColumn + instruction.name.length]
          };
        }

        instruction.type = 'DICTIONARY_ENTRY';
        instruction.value = match[matcher.DICTIONARY_ENTRY_VALUE_INDEX] || null;

        if(instruction.value) {
          const valueColumn = instruction.line.lastIndexOf(instruction.value);
          instruction.ranges.value = [valueColumn, valueColumn + instruction.value.length];
        }

        continue;
      }


      const blockDashes = match[matcher.BLOCK_DASHES_INDEX];
      if(blockDashes) {
        instruction.name = match[matcher.BLOCK_NAME_INDEX];
        instruction.type = 'BLOCK';

        const operatorColumn = instruction.line.indexOf(blockDashes);
        const nameColumn = instruction.line.lastIndexOf(instruction.name);
        instruction.ranges = {
          blockOperator: [operatorColumn, operatorColumn + blockDashes.length],
          name: [nameColumn, nameColumn + instruction.name.length]
        };

        const nameEscaped = instruction.name.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
        expectedBlockTerminator = new RegExp(`^\\s*(${blockDashes})\\s*(${nameEscaped})\\s*$`);
        unterminatedBlock = instruction;

        continue;
      }


      if(match[matcher.APPEND_WITH_NEWLINE_OPERATOR_INDEX]) {
        instruction.separator = '\n';
        instruction.type = 'FIELD_APPEND';
        instruction.value = match[matcher.APPEND_WITH_NEWLINE_VALUE_INDEX] || null;

        const operatorColumn = instruction.line.indexOf('|');
        instruction.ranges = { appendWithNewlineOperator: [operatorColumn, operatorColumn + 1] };

        if(instruction.value) {
          const valueColumn = instruction.line.lastIndexOf(instruction.value);
          instruction.ranges.value = [valueColumn, valueColumn + instruction.value.length];
        }

        continue;
      }


      if(match[matcher.APPEND_WITH_SPACE_OPERATOR_INDEX]) {
        instruction.separator = ' ';
        instruction.type = 'FIELD_APPEND';
        instruction.value = match[matcher.APPEND_WITH_SPACE_VALUE_INDEX] || null;

        const operatorColumn = instruction.line.indexOf('\\');
        instruction.ranges = { appendWithSpaceOperator: [operatorColumn, operatorColumn + 1] };

        if(instruction.value) {
          const valueColumn = instruction.line.lastIndexOf(instruction.value);
          instruction.ranges.value = [valueColumn, valueColumn + instruction.value.length];
        }

        continue;
      }

      const sectionOperator = match[matcher.SECTION_HASHES_INDEX];
      if(sectionOperator) {
        instruction.depth = sectionOperator.length;
        instruction.type = 'SECTION';

        const sectionOperatorColumn = instruction.line.indexOf(sectionOperator);
        const unescapedName = match[matcher.SECTION_NAME_UNESCAPED_INDEX];
        let nameEndColumn;

        if(unescapedName) {
          instruction.name = unescapedName;

          const nameColumn = instruction.line.indexOf(instruction.name, sectionOperatorColumn + sectionOperator.length);
          nameEndColumn = nameColumn + unescapedName.length;

          instruction.ranges = {
            name: [nameColumn, nameColumn + unescapedName.length],
            sectionOperator: [sectionOperatorColumn, sectionOperatorColumn + sectionOperator.length]
          };
        } else {
          instruction.name = match[matcher.SECTION_NAME_ESCAPED_INDEX];

          const escapeOperator = match[matcher.SECTION_NAME_ESCAPED_QUOTES_INDEX];
          const escapeBeginOperatorColumn = instruction.line.indexOf(escapeOperator, sectionOperatorColumn + sectionOperator.length);
          const nameColumn = instruction.line.indexOf(instruction.name, escapeBeginOperatorColumn + escapeOperator.length);
          const escapeEndOperatorColumn = instruction.line.indexOf(escapeOperator, nameColumn + instruction.name.length);
          nameEndColumn = escapeEndOperatorColumn + escapeOperator.length;

          instruction.ranges = {
            escapeBeginOperator: [escapeBeginOperatorColumn, escapeBeginOperatorColumn, + escapeOperator.length],
            escapeEndOperator: [escapeEndOperatorColumn, escapeEndOperatorColumn, + escapeOperator.length],
            name: [nameColumn, nameColumn + instruction.name.length],
            sectionOperator: [sectionOperatorColumn, sectionOperatorColumn + sectionOperator.length]
          };
        }

        const template = match[matcher.SECTION_TEMPLATE_INDEX];
        if(template) {
          instruction.template = template;

          const copyOperator = match[matcher.SECTION_COPY_OPERATOR_INDEX];
          const copyOperatorColumn = instruction.line.indexOf(copyOperator, nameEndColumn);
          const templateColumn = instruction.line.indexOf(template, copyOperatorColumn + copyOperator.length);

          if(copyOperator === '<') {
            instruction.deepCopy = false;
            instruction.ranges.copyOperator = [copyOperatorColumn, copyOperatorColumn + copyOperator.length];
          } else { // copyOperator === '<<'
            instruction.deepCopy = true;
            instruction.ranges.deepCopyOperator = [copyOperatorColumn, copyOperatorColumn + copyOperator.length];
          }

          instruction.ranges.template = [templateColumn, templateColumn + template.length];
        }

        continue;
      }


      const template = match[matcher.TEMPLATE_INDEX];
      if(template) {
        const unescapedName = match[matcher.NAME_UNESCAPED_INDEX];

        if(unescapedName) {
          instruction.name = unescapedName;

          const nameColumn = instruction.line.indexOf(instruction.name);
          const copyOperatorColumn = instruction.line.indexOf('<', nameColumn + instruction.name.length);

          instruction.ranges = {
            copyOperator: [copyOperatorColumn, copyOperatorColumn + 1],
            name: [nameColumn, nameColumn + instruction.name.length]
          };
        } else {
          instruction.name = match[matcher.NAME_ESCAPED_INDEX];

          const escapeOperator = match[matcher.NAME_ESCAPED_QUOTES_INDEX];
          const escapeBeginOperatorColumn = instruction.line.indexOf(escapeOperator);
          const nameColumn = instruction.line.indexOf(instruction.name, escapeBeginOperatorColumn + escapeOperator.length);
          const escapeEndOperatorColumn = instruction.line.indexOf(escapeOperator, nameColumn + instruction.name.length);
          const copyOperatorColumn = instruction.line.indexOf('<', escapeEndOperatorColumn + escapeOperator.length);

          instruction.ranges = {
            copyOperator: [copyOperatorColumn, copyOperatorColumn + 1],
            escapeBeginOperator: [escapeBeginOperatorColumn, escapeBeginOperatorColumn, + escapeOperator.length],
            escapeEndOperator: [escapeEndOperatorColumn, escapeEndOperatorColumn, + escapeOperator.length],
            name: [nameColumn, nameColumn + instruction.name.length]
          };
        }

        instruction.template = template;
        instruction.type = 'NAME';

        const templateColumn = instruction.line.lastIndexOf(template);
        instruction.ranges.template = [templateColumn, templateColumn + template.length];

        continue;
      }

    } else {
      throw errors.invalidLine(context, instruction);
    }
  }

  if(unterminatedBlock) {
    throw errors.unterminatedBlock(context, unterminatedBlock);
  }
};
