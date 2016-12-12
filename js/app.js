import 'css/styles.css';
import Pen from 'pen';
import Polygon from 'polygon';

(() => {
  const canvas = document.getElementById('canvas');
  const pen = new Pen(canvas.getContext('2d'));
  const radius = 100;
  const polygon = Polygon.makeRandom(radius);
  pen.draw(polygon);
})();
