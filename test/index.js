'use strict';

const should = require('chai').should();
const color = require('../');

describe('sync guess by values', function () {

  describe('hex #000000', function () {
    it('check black', function (done) {
      color.guess('#000000').should.eql('Black');
      done();
    });
  });

  describe('array [0, 0, 0]', function () {
    it('check black', function (done) {
      color.guess([0, 0, 0]).should.eql('Black');
      done();
    });
  });

  describe('object { r: 0, g: 0, b: 0 }', function () {
    it('check black', function (done) {
      color.guess({ r: 0, g: 0, b: 0 }).should.eql('Black');
      done();
    });
  });

});

describe('async guess by values', function () {

  describe('hex #000000', function () {
    it('check black', function (done) {
      color.guess('#000000', (err, res) => {
        res.should.eql('Black');
        done();
      });
    });
  });

  describe('array [0, 0, 0]', function () {
    it('check black', function (done) {
      color.guess([0, 0, 0], (err, res) => {
        res.should.eql('Black');
        done();
      });
    });
  });

  describe('object { r: 0, g: 0, b: 0 }', function () {
    it('check black', function (done) {
      color.guess({ r: 0, g: 0, b: 0 }, (err, res) => {
        res.should.eql('Black');
        done();
      });
    });
  });

});

describe('guess by name', function () {
  it('test Black', function (done) {
    color.guessByName('Black', (err, res) => {
      res.should.eql([0, 0, 0]);
      done();
    });
  });
  it('test SteelBlue', function (done) {
    let res = color.guessByName('SteelBlue');
    res.should.eql([70, 130, 180]);
    done();
  });
});

describe('image', function () {

  describe('static/ folder', function () {
    it('test.png is SteelBlue', function (done) {
      color.guessByImage('./test/static/test.png', (err, res) => {
        res.should.eql([['SteelBlue', [70, 130, 180], '1.00']]);
        done();
      });
    });

    it('black.png is Black', function (done) {
      color.guessByImage('./test/static/black.png', (err, res) => {
        res.should.eql(
          [['Black', [0, 0, 0], '0.96'],
            ['Maroon', [128, 0, 0], '0.00'],
            ['DarkSlateBlue', [72, 61, 139], '0.00'],
            ['Azure', [240, 255, 255], '0.00'],
            ['White', [255, 255, 255], '0.01'],
            ['LightSalmon', [255, 160, 122], '0.00'],
            ['DarkSlateGray', [47, 79, 79], '0.02'],
            ['DarkOliveGreen', [85, 107, 47], '0.00'],]
          );
        done();
      });
    });
  });

});

describe('error', function () {

  it('check nothing', function (done) {
    try {
      color.guess();
    }
    catch (result) {
      (result instanceof Error).should.equal(true);
      String(result).should.match(/^Error: Color must be/);
    }

    done();
  });

  it('check empty array', function (done) {
    try {
      color.guess([]);
    }
    catch (result) {
      (result instanceof Error).should.equal(true);
      String(result).should.match(/^Error: Color must be/);
    }

    done();
  });

  it('find imagine color', function (done) {
    try {
      color.guessByName('SteelBlueDarkRedYellow');
    }
    catch (err) {
      (err instanceof Error).should.equal(true);
      String(err).should.match(/^Error: Color not found/);
    }

    done();
  });

  it('find imagine color async', function (done) {
    color.guessByName('SteelBlueDarkRedYellow', (err, result) => {
      err.should.match(/^Error: Color not found/);
      done();
    })
  });

  describe('static/ folder', function () {
    it('no.png not exists', function (done) {
      color.guessByImage('./test/static/no.png', (err, res) => {
        (err instanceof Error).should.equal(true);
        String(err).should.match(/^Error: Input file is missing/);
        done();
      });
    });
  });

});
