import Color from 'color';

describe('Color', () => {
  describe('.generateRandom', () => {
    it('generates a random hex color string', () => {
      const color = Color.generateRandom();
      const hexColorRegex = /^#(?:[0-9a-fA-F]{3}){1,2}$/i;

      expect(color).toMatch(hexColorRegex);
    });
  });
});
