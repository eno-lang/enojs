const messages = require('../../lib/messages.js');

const input = `
> comment
language: eno




`.trim();

module.exports = {
  indexing: 1,
  input: input,
  instructions: [
    {
      index: 0,
      length: 9,
      line: 0,
      ranges: {
        name: [0, 8],
        comment_operator: [0, 1],
        comment: [2, 9]
      },
      type: 'NOOP'
    },
    {
      index: 10,
      length: 13,
      line: 1,
      ranges: {
        name: [0, 8],
        name_operator: [8, 9],
        value: [10, 13]
      },
      type: 'FIELD'
    },
    {
      index: 11,
      length: 0,
      line: 2,
      type: 'NOOP'
    },
    {
      index: 12,
      length: 0,
      line: 3,
      type: 'NOOP'
    },
    {
      index: 13,
      length: 0,
      line: 4,
      type: 'NOOP'
    },
    {
      index: 14,
      length: 0,
      line: 5,
      type: 'NOOP'
    }
  ],
  messages: messages['en']
}
