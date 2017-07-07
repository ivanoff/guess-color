
[![NPM version][npm-version-image]][npm-url]
[![NPM downloads][npm-downloads-image]][npm-url]
[![MIT License][license-image]][license-url]
[![js-standard-style][standard-style-image]][standard-style-url]
[![Build Status: Linux][travis-image]][travis-url]
[![Build Status: Windows][appveyor-image]][appveyor-url]
[![Coverage Status][coveralls-image]][coveralls-url]


# guess-color

### Guess Color

 v1.1.0


## Installation
```npm i -S guess-color```


## Usage

```javascript
var color = require('guess-color');

console.log( color.guess( '#000000' ) ); // Black

console.log( color.guess( [128, 128, 128] ) ); // Grey

console.log( color.guess( {r:75, g:0, b:130} ) ); // Indigo

```

## Tests

```npm test```


## Change Log

[all changes](CHANGELOG.md)


## Created by

Dimitry, 2@ivanoff.org.ua

```curl -A cv ivanoff.org.ua```


[license-image]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat
[license-url]: LICENSE

[standard-style-image]: https://img.shields.io/badge/code%20style-airbnb-blue.svg?style=flat
[standard-style-url]: https://github.com/airbnb/javascript

[npm-url]: https://npmjs.org/package/guess-color
[npm-version-image]: http://img.shields.io/npm/v/guess-color.svg?style=flat
[npm-downloads-image]: http://img.shields.io/npm/dm/guess-color.svg?style=flat

[travis-url]: https://travis-ci.org/ivanoff/guess-color
[travis-image]: https://travis-ci.org/ivanoff/guess-color.svg?branch=master

[appveyor-url]: https://ci.appveyor.com/project/ivanoff/guess-color/branch/master
[appveyor-image]: https://ci.appveyor.com/api/projects/status/lp3nhnam1eyyqh33/branch/master?svg=true

[coveralls-url]: https://coveralls.io/github/ivanoff/guess-color
[coveralls-image]: https://coveralls.io/repos/github/ivanoff/guess-color/badge.svg
