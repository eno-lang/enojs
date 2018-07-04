const eno = require('enojs');
const { loaders } = require('enojs');

describe('datetime', () => {

  let document;

  describe('1997', () => {
    it('returns a correctly set Date object', () => {
      document = eno.parse('datetime: 1997');
      expect(document.field('datetime', loaders.datetime)).toMatchSnapshot();
    });
  });

  describe('1997-07', () => {
    it('returns a correctly set Date object', () => {
      document = eno.parse('datetime: 1997-07');
      expect(document.field('datetime', loaders.datetime)).toMatchSnapshot();
    });
  });

  describe('1997-07-16', () => {
    it('returns a correctly set Date object', () => {
      document = eno.parse('datetime: 1997-07-16');
      expect(document.field('datetime', loaders.datetime)).toMatchSnapshot();
    });
  });

  describe('1997-07-16T19:20+01:00', () => {
    it('returns a correctly set Date object', () => {
      document = eno.parse('datetime: 1997-07-16T19:20+01:00');
      expect(document.field('datetime', loaders.datetime)).toMatchSnapshot();
    });
  });

  describe('1997-07-16T19:20:30+01:00', () => {
    it('returns a correctly set Date object', () => {
      document = eno.parse('datetime: 1997-07-16T19:20:30+01:00');
      expect(document.field('datetime', loaders.datetime)).toMatchSnapshot();
    });
  });

  describe('1997-07-16T19:20:30.45+01:00', () => {
    it('returns a correctly set Date object', () => {
      document = eno.parse('datetime: 1997-07-16T19:20:30.45+01:00');
      expect(document.field('datetime', loaders.datetime)).toMatchSnapshot();
    });
  });

  describe('1994-11-05T08:15:30-05:00', () => {
    it('returns a correctly set Date object', () => {
      document = eno.parse('datetime: 1994-11-05T08:15:30-05:00');
      expect(document.field('datetime', loaders.datetime)).toMatchSnapshot();
    });
  });

  describe('1994-11-05T13:15:30Z', () => {
    it('returns a correctly set Date object', () => {
      document = eno.parse('datetime: 1994-11-05T13:15:30Z');
      expect(document.field('datetime', loaders.datetime)).toMatchSnapshot();
    });
  });

  describe('2002 12 14', () => {
    it('throws an error', () => {
      document = eno.parse('datetime: 2002 12 14');
      expect(() => document.field('datetime', loaders.datetime)).toThrowErrorMatchingSnapshot();
    });
  });

  describe('January', () => {
    it('throws an error', () => {
      document = eno.parse('datetime: January');
      expect(() => document.field('datetime', loaders.datetime)).toThrowErrorMatchingSnapshot();
    });
  });

  describe('13:00', () => {
    it('throws an error', () => {
      document = eno.parse('datetime: 13:00');
      expect(() => document.field('datetime', loaders.datetime)).toThrowErrorMatchingSnapshot();
    });
  });
});
