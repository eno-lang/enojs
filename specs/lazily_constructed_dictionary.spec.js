const eno = require('../eno.js');
const EnoDictionary = require('../lib/elements/dictionary.js');

const sample = `
languages:
`;

describe('Lazily constructed dictionary', () => {

  describe('application fetching an empty element as a dictionary', () => {
    const document = eno.parse(sample);
    const dictionary = document.dictionary('languages');

    it('returns a dictionary', () => {
      expect(dictionary instanceof EnoDictionary).toBe(true);
    });

    it('has enforcePresence disabled', () => {
      expect(dictionary.enforcePresenceDefault).toBe(false);
    });

    describe('when enforcePresence was enabled on the document', () => {
      document.enforcePresence();
      const dictionary = document.dictionary('languages');

      it('has enforcePresence enabled', () => {
        expect(dictionary.enforcePresenceDefault).toBe(true);
      });
    });
  });
});
