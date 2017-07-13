'use strict';

const sharp = require('sharp');

const colors = require('./colors.json');
const colorsName = Object.keys(colors);

exports = module.exports = {

  guess: function (color, next) {
    let result = '';
    let resultDelta = Infinity;
    let err;

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
      err = new Error('Color must be string (ex."#00FF8F"), array (ex.[0,255,146])'
        + ' or object (ex.{r:0, g:255, b:146})');
    }

    if (typeof next === 'function') {
      next(err, result);
    } else {
      if (err) throw(err);
      return result;
    }

  },

  guessByName: function (name, next) {
    let result = colors[name];
    let err = result ? null : new Error('Color not found');
    if (typeof next === 'function') {
      next(err, result);
    } else {
      if (err) throw(err);
      return result;
    }
  },

  guessByImage: function (path, next) {
    var _this = this;
    var colorsCounter = {};
    var resultsCounter = {};
    var total = 0;
    sharp(path)
      .resize(100, 100)
      .max()
      .raw()
      .toBuffer((err, buf) => {
        if (err) return next(err);
        let match = buf.toString('hex').match(/[0-9a-z]{6}/ig);
        for (let i = 0; i < match.length; i++) {
          let color = _this.guess('#' + match[i]);
          if (!resultsCounter[match[i]]) {
            resultsCounter[match[i]] = 0;
          }

          if (!colorsCounter[color]) {
            colorsCounter[color] = 0;
          }

          resultsCounter[match[i]]++;
          colorsCounter[color]++;
          total++;
        }

        var sortableColors = [];
        for (var name in colorsCounter) {
          sortableColors.push(
            [name, _this.guessByName(name), (colorsCounter[name] / total).toFixed(2)]
          );
        }

        sortableColors.sort((a, b) => b[1] - a[1]);

        next(null, sortableColors);
      });
  },

};
