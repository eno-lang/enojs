const eno = require('enojs');
const { Field } = require('enojs');

const input = `
colors:
- #ff0000
- #00ff00
- #0000ff

email: jane.doe@eno-lang.org

ratings:
excellent = 1
fine = 2
ok = 3

url:
|
`.trim();

describe('Loader bootstrapping', () => {
  let document;

  beforeAll(() => {
    document = eno.parse(input);
  });

  describe('Fieldset', () => {
    let ratings;

    beforeEach(() => {
      ratings = document.fieldset('ratings');
    })

    it('bootstraps loaders as entry proxy methods', () => {
      expect(ratings.number('excellent')).toBe(1);
    });

    describe('with optional arguments', () => {
      it('passes them on', () => {
        const result = ratings.number('excellent', { withElement: true });

        expect(result.element instanceof Field).toBe(true);
        expect(result.value).toEqual(1);
      });
    });
  });

  describe('List', () => {
    let colorList;

    beforeEach(() => {
      colorList = document.element('colors');
    })

    it('bootstraps loaders as *Items proxy methods', () => {
      expect(colorList.colorItems()).toEqual(['#ff0000', '#00ff00', '#0000ff']);
    });

    describe('with optional arguments', () => {
      it('passes them on', () => {
        const items = colorList.colorItems({ withElements: true });

        for(let item of items) {
          expect(item.element instanceof Field).toBe(true);
          expect(typeof item.value).toEqual('string');
        }
      });
    });
  });

  describe('Section', () => {
    describe('Loaders as field proxy methods', () => {
      it('bootstraps them', () => {
        expect(document.email('email')).toEqual('jane.doe@eno-lang.org');
      });

      describe('with optional arguments', () => {
        it('passes them on', () => {
          const result = document.email('email', { withElement: true });

          expect(result.element instanceof Field).toBe(true);
          expect(result.value).toEqual('jane.doe@eno-lang.org');
        });
      });
    });

    describe('Loaders as *List proxy methods', () => {
      it('bootstraps them', () => {
        expect(document.colorList('colors')).toEqual(['#ff0000', '#00ff00', '#0000ff']);
      });

      describe('with optional arguments', () => {
        it('passes them on', () => {
          const items = document.colorList('colors', { withElements: true });

          for(let item of items) {
            expect(item.element instanceof Field).toBe(true);
            expect(typeof item.value).toEqual('string');
          }
        });
      });
    });
  });

  describe('Field', () => {
    let emailField;

    beforeEach(() => {
      emailField = document.element('email');
    })

    it('bootstraps loaders as value proxy methods', () => {
      expect(emailField.email()).toEqual('jane.doe@eno-lang.org');
    });

    describe('with optional arguments', () => {
      it('passes them on', () => {
        const urlField = document.element('url');

        expect(() => urlField.url({ required: true })).toThrowErrorMatchingSnapshot();
      });
    });
  });
});
