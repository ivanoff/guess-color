'use strict';

const colors = require('./colors.json');
const colorsName = Object.keys(colors);

exports = module.exports = {

  guess: function (color) {
    let result = '';
    let resultDelta = Infinity;

    if (typeof color === 'string') {
      let m = color.match(/^#([\da-z]{2})([\da-z]{2})([\da-z]{2})$/i);
      color = [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
    }

    if (color && typeof color.r !== 'undefined'
        && typeof color.g !== 'undefined'
        && typeof color.b !== 'undefined') {
      color = [color.r, color.g, color.b];
    }

    if (Array.isArray(color) && color.length === 3) {

      for (let i = 0; i < colorsName.length; i++) {
        let name = colorsName[i];
        let c = colors[name];
        let delta = 0;
        for (let j = 0; j <= 2; j++) {
          delta += Math.abs(c[j] - color[j]);
        }

        if (delta < resultDelta) {
          resultDelta = delta;
          result = name;
        }
      }

    } else {
      let err = new Error('Color must be string (ex."#00FF8F"), array (ex.[0,255,146])'
        + ' or object (ex.{r:0, g:255, b:146})');
      throw err;
    }

    return result;

  },

};
