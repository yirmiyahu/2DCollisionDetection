import ColorScheme from 'color-scheme';
import { random } from 'util';

const Color = {
  generateRandom() {
    const randomScheme = new ColorScheme()
      .from_hue(random(359))
      .scheme('monochromatic')
      .variation('hard')
      .web_safe(false);
    const randomHexColors = randomScheme.colors();
    const vibrantIdx = 3;
    return `#${randomHexColors[vibrantIdx]}`;
  }
};

export default Color;
