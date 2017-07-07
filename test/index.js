'use strict';

const should = require('chai').should();
const color = require('../');

describe('name', function () {

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

});
