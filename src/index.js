const Jimp = require('jimp');
const colors = require('./colors.json');

function guess(whatIsIt) {
  let color = whatIsIt;

  if (typeof whatIsIt === 'string') {
    if (colors[whatIsIt]) return colors[whatIsIt];

    const m = whatIsIt.match(/^#([\da-z]{2})([\da-z]{2})([\da-z]{2})$/i);
    if (!m) throw new Error('Color not found');

    color = m.map(item => parseInt(item, 16)).slice(1);
  }

  if (Object.prototype.hasOwnProperty.call(whatIsIt, 'r')) {
    const { r, g, b } = whatIsIt;
    if ([r, g, b].filter(Number.isInteger).length) {
      color = [r, g, b];
    }
  }

  if (!Array.isArray(color) || color.length !== 3) {
    throw new Error('Color must to be string ("#00FF8F"), array ([0,255,146]) or object ({r:0, g:255, b:146})');
  }

  let result;
  let minDistance = Infinity;

  for (const name of Object.keys(colors)) {
    const c = colors[name];
    const p = i => (c[i] - color[i]) ** 2;
    const distance = Math.sqrt(p(0) + p(1) + p(2));

    if (minDistance > distance) {
      minDistance = distance;
      result = name;
    }
  }

  return result;
}

async function guessByImage(path) {
  return new Promise((resolve, reject) => {
    Jimp.read(path, (err, image) => {
      if (err) return reject(err);

      const colorsCache = {};
      const colorsCounter = {};

      image.resize(500, 500, Jimp.RESIZE_NEAREST_NEIGHBOR);

      const { width, height, data } = image.bitmap;
      image.scan(0, 0, width, height, (x, y, idx) => {
        const [r, g, b] = data.slice(idx);
        const key = `${r}-${g}-${b}`;
        if (!colorsCache[key]) {
          colorsCache[key] = guess([r, g, b]);
        }
        if (!colorsCounter[colorsCache[key]]) {
          colorsCounter[colorsCache[key]] = 0;
        }
        colorsCounter[colorsCache[key]]++;
      });

      const result = [];
      for (const colorName of Object.keys(colorsCounter)) {
        const colorData = guess(colorName);
        const weight = parseFloat((colorsCounter[colorName] / (width * height)).toFixed(4));
        result.push([colorName, colorData, weight]);
      }

      return resolve(result.sort((a, b) => b[2] - a[2]));
    });
  });
}

async function imageByName(name, fileName) {
  const color = guess(name).map(item => (`00${item.toString(16)}`).slice(-2)).join('');
  return new Promise((resolve) => {
    const image = new Jimp(100, 100, `#${color}`);
    resolve(fileName ? image.writeAsync(fileName) : image);
  });
}

module.exports = name => (typeof name !== 'undefined' ? guess(name) : { guess, guessByImage, imageByName });
