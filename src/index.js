const { Image } = require('image-js');

const defaultColor = 'web';
const allColors = require('./colors');

let colors = allColors[defaultColor];

let colorGroups;

function updateColorGroups() {
  colorGroups = {};
  for (const key of Object.keys(colors)) {
    const [a, b, c] = colors[key];
    const s = Math.trunc((a + b + c) / 50);

    if (!colorGroups[`${s}`]) colorGroups[`${s}`] = {};
    colorGroups[`${s}`][key] = colors[key];
    if (!colorGroups[`${s - 1}`]) colorGroups[`${s - 1}`] = {};
    colorGroups[`${s - 1}`][key] = colors[key];
    if (!colorGroups[`${s + 1}`]) colorGroups[`${s + 1}`] = {};
    colorGroups[`${s + 1}`][key] = colors[key];
  }
}
updateColorGroups();

const colorsGlobalCache = {};

function guess(whatIsIt, { useCache, useGroups } = {}) {
  let color = whatIsIt;

  if (typeof whatIsIt === 'string') {
    if (colors[whatIsIt]) return colors[whatIsIt];

    const m = whatIsIt.match(/^#([\da-z]{2})([\da-z]{2})([\da-z]{2})$/i);
    if (!m) throw new Error('Color not found');

    color = m.map((item) => parseInt(item, 16)).slice(1);
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

  const cacheKey = color.join('-');
  if (useCache && colorsGlobalCache[cacheKey]) return colorsGlobalCache[cacheKey];

  let result;
  let minDistance = Infinity;

  const s = Math.trunc((color[0] + color[1] + color[2]) / 50);

  const cc = useGroups ? colorGroups[`${s}`] : colors;

  for (const name of Object.keys(cc)) {
    const c = cc[name];
    const p = (i) => (c[i] - color[i]) ** 2;
    const distance = Math.sqrt(p(0) + p(1) + p(2));

    if (minDistance > distance) {
      minDistance = distance;
      result = name;
    }
  }

  if (useCache) colorsGlobalCache[cacheKey] = result;

  return result;
}

async function guessByImage(path, {
  width, height, useCache, useGroups,
} = {}) {
  const image = await Image.load(path);

  const colorsCache = {};
  const colorsCounter = {};

  const w = width || image.width;
  const h = height || image.height;

  const data = width ? image.resize({ width, height }).getPixelsArray() : image.getPixelsArray();

  for (const [r, g, b] of data) {
    const key = `${r}-${g}-${b}`;
    if (!colorsCache[key]) {
      colorsCache[key] = guess([r, g, b]);
    }
    if (!colorsCounter[colorsCache[key]]) {
      colorsCounter[colorsCache[key]] = 0;
    }
    colorsCounter[colorsCache[key]]++;
  }

  const result = [];
  for (const colorName of Object.keys(colorsCounter)) {
    const colorData = guess(colorName, { useCache, useGroups });
    const weight = parseFloat((colorsCounter[colorName] / (w * h)).toFixed(4));
    result.push([colorName, colorData, weight]);
  }

  return result.sort((a, b) => b[2] - a[2]);
}

function imageByName(name, fileName) {
  const color = guess(name);
  const image = new Image(10, 10);
  for (let i = 0; i < 10 * 10; i++) {
    image.setPixel(i, color);
  }
  return fileName ? image.save(fileName) : image;
}

function setPalette(name = defaultColor) {
  colors = allColors[name] || colors;
  updateColorGroups();
}

function getPalette() {
  return colors;
}

function paletteNames() {
  return Object.keys(allColors);
}

module.exports = {
  guess, guessByImage, imageByName, setPalette, getPalette, paletteNames,
};
