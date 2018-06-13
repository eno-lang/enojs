const eno = require('../eno.js');

describe('Field append behaviour', () => {
  test('empty newlines are only appended between non-empty lines', () => {
    const document = eno.parse(`
      field:
      |
      | foo
      |
      | bar
      |
    `);

    expect(document.field('field')).toEqual('foo\n\nbar');
  });

  test('empty append with space instructions are always ignored', () => {
    const document = eno.parse(`
      field:
      \\
      \\ foo
      \\
      \\ bar
      \\
    `);

    expect(document.field('field')).toEqual('foo bar');
  });

  test('newlines copied from blocks are not trimmed away', () => {
    const document = eno.parse(`
      -- block

      inbetween whitespace

      -- block

      field < block
    `);

    expect(document.field('field')).toMatchSnapshot();
  });

  test('newlines copied from blocks with appendices are handled correctly', () => {
    const document = eno.parse(`
      -- block

      inbetween block newlines

      -- block

      field < block
      |
      | inbetween appended newlines
      |
    `);

    expect(document.field('field')).toMatchSnapshot();
  });
});
