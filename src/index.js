const sharp = require('sharp');
const colors = require('./colors.json');

function guess(whatIsIt) {
  let color = whatIsIt;

  if (typeof whatIsIt === 'string') {
    if (colors[whatIsIt]) return colors[whatIsIt];

    const m = whatIsIt.match(/^#([\da-z]{2})([\da-z]{2})([\da-z]{2})$/i);
    if (!m) throw new Error('Color not found');

    color = m.map(item => parseInt(item, 16)).slice(1);
  }

  const { r, g, b } = color || {};
  if ([r, g, b].filter(Number.isInteger).length) {
    color = [r, g, b];
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
    sharp(path)
      .resize(100, 100, { fit: sharp.fit.inside })
      .raw()
      .toBuffer((err, buf) => {
        if (err) return reject(err);

        const colorsCache = {};
        const colorsCounter = {};
        const match = buf.toString('hex').match(/[0-9a-z]{6}/ig);

        for (const toCheck of match) {
          if (!colorsCache[toCheck]) {
            colorsCache[toCheck] = guess(`#${toCheck}`);
          }
          if (!colorsCounter[colorsCache[toCheck]]) {
            colorsCounter[colorsCache[toCheck]] = 0;
          }
          colorsCounter[colorsCache[toCheck]]++;
        }

        const result = [];
        for (const colorName of Object.keys(colorsCounter)) {
          const colorData = guess(colorName);
          const weight = parseFloat((colorsCounter[colorName] / match.length).toFixed(2));
          result.push([colorName, colorData, weight]);
        }

        return resolve(result.sort((a, b) => b[2] - a[2]));
      });
  });
}

module.exports = name => (typeof name !== 'undefined' ? guess(name) : { guess, guessByImage });
