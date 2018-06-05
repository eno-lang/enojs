const { EnoError, EnoParseError, EnoValidationError } = require('../../lib/errors.js');

const text = 'My error';
const snippet = 'My snippet'
const selection = [[1, 2], [3, 4]]
const cursor = selection[0];

for(let _class of [EnoError, EnoParseError, EnoValidationError]) {

  describe(_class.name, () => {
    const error = new _class(text, snippet, selection);

    it('returns the expected message', () => {
      expect(error.message).toMatchSnapshot();
    });

    it('returns the expected text', () => {
      expect(error.text).toEqual(text);
    });

    it('returns the expected snippet', () => {
      expect(error.snippet).toEqual(snippet);
    });

    it('returns the expected selection range', () => {
      expect(error.selection).toEqual(selection);
    });

    it('returns the expected cursor location', () => {
      expect(error.cursor).toEqual(cursor);
    });
  });

}
