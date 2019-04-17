const { describe, it } = require('mocha');
const { expect } = require('chai');
const color = require('../src');

describe('guess black by values', () => {
  it('hex #000000', () => expect(color('#000000')).eql('Black'));
  it('array [0, 0, 0]', () => expect(color([0, 0, 0])).eql('Black'));
  it('object { r: 0, g: 0, b: 0 }', () => expect(color({ r: 0, g: 0, b: 0 })).eql('Black'));
});

describe('guess by name', () => {
  it('test Black', () => expect(color('Black')).eql([0, 0, 0]));
  it('test SteelBlue', () => expect(color('SteelBlue')).eql([70, 130, 180]));
});

describe('find colors in image file', () => {
  it('test.png is SteelBlue', async () => {
    const res = await color().guessByImage('./test/static/test.png');
    expect(res).eql([['SteelBlue', [70, 130, 180], 1]]);
  });

  it('black.png is mostly Black', async () => {
    const res = await color().guessByImage('./test/static/black.png');
    expect(res).eql([
      ['Black', [0, 0, 0], 0.96],
      ['DarkSlateGray', [47, 79, 79], 0.02],
      ['White', [255, 255, 255], 0.01],
      ['Maroon', [128, 0, 0], 0],
      ['DarkSlateBlue', [72, 61, 139], 0],
      ['Azure', [240, 255, 255], 0],
      ['Khaki', [240, 230, 140], 0],
      ['MidnightBlue', [25, 25, 112], 0],
    ]);
  });
});

describe('errors', () => {
  it('check nothing', () => {
    try {
      color();
    } catch (result) {
      expect(result instanceof Error).equal(true);
      expect(String(result)).match(/^Error: Color must to be/);
    }
  });

  it('check zero', () => {
    try {
      color(0);
    } catch (result) {
      expect(result instanceof Error).equal(true);
      expect(String(result)).match(/^Error: Color must to be/);
    }
  });

  it('check empty array', () => {
    try {
      color([]);
    } catch (result) {
      expect(result instanceof Error).equal(true);
      expect(String(result)).match(/^Error: Color must to be/);
    }
  });

  it('non existent color', () => {
    try {
      color('SteelBlueDarkRedYellow');
    } catch (err) {
      expect(err instanceof Error).equal(true);
      expect(String(err)).match(/^Error: Color not found/);
    }
  });

  it('file not exists', async () => {
    try {
      await color().guessByImage('./test/static/no.png');
    } catch (err) {
      expect(err instanceof Error).equal(true);
      expect(String(err)).match(/^Error: Input file is missing/);
    }
  });
});
