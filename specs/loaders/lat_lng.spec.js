const eno = require('enojs');
const { loaders } = require('enojs');

describe('latLng', () => {

  let document;

  describe('48.205870, 16.413690', () => {
    it('returns a lat/lng object', () => {
      document = eno.parse('coordinates: 48.205870, 16.413690');
      expect(document.field('coordinates', loaders.latLng)).toEqual({ lat: 48.205870, lng: 16.413690 });
    });
  });

  describe('48.205870,', () => {
    it('throws an error', () => {
      document = eno.parse('coordinates: 48.205870,');
      expect(() => document.field('coordinates', loaders.latLng)).toThrowErrorMatchingSnapshot();
    });
  });

  describe(', 16.413690', () => {
    it('throws an error', () => {
      document = eno.parse('coordinates: , 16.413690');
      expect(() => document.field('coordinates', loaders.latLng)).toThrowErrorMatchingSnapshot();
    });
  });

  describe('48,205870, 16,413690', () => {
    it('throws an error', () => {
      document = eno.parse('coordinates: 48,205870, 16,413690');
      expect(() => document.field('coordinates', loaders.latLng)).toThrowErrorMatchingSnapshot();
    });
  });
});
