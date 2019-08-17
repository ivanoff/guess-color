const { describe, it, after } = require('mocha');
const { expect } = require('chai');
const fs = require('fs');
const path = require('path');
const color = require('../src');

describe('Guess black by values', () => {
  it('hex #000000', () => expect(color('#000000')).eql('Black'));
  it('array [0, 0, 0]', () => expect(color([0, 0, 0])).eql('Black'));
  it('object { r: 0, g: 0, b: 0 }', () => expect(color({ r: 0, g: 0, b: 0 })).eql('Black'));
});

describe('Guess by name', () => {
  it('test Black', () => expect(color('Black')).eql([0, 0, 0]));
  it('test SteelBlue', () => expect(color('SteelBlue')).eql([70, 130, 180]));
});

describe('Find colors in image file', () => {
  it('test.png is SteelBlue', async () => {
    const res = await color().guessByImage('./test/static/test.png');
    expect(res).eql([['SteelBlue', [70, 130, 180], 1]]);
  });

  it('black.png is mostly Black', async () => {
    const res = await color().guessByImage('./test/static/black.png');
    expect(res).eql([
      ['Black', [0, 0, 0], 0.9586],
      ['DarkSlateGray', [47, 79, 79], 0.0169],
      ['White', [255, 255, 255], 0.0121],
      ['Maroon', [128, 0, 0], 0.0026],
      ['DarkSlateBlue', [72, 61, 139], 0.0024],
      ['Azure', [240, 255, 255], 0.0024],
      ['Khaki', [240, 230, 140], 0.0024],
      ['MidnightBlue', [25, 25, 112], 0.0024],
    ]);
  });
});

describe('File by color name', () => {
  const fileName = path.join(__dirname, 'temp.jpg');

  after(() => {
    fs.unlinkSync(fileName);
  });

  it('black', async () => {
    const name = 'Black';
    await color().imageByName(name, fileName);
    const res = await color().guessByImage(fileName);
    expect(res).eql([[name, color(name), 1]]);
  });

  it('DarkSlateBlue', async () => {
    const name = 'DarkSlateBlue';
    await color().imageByName(name, fileName);
    const res = await color().guessByImage(fileName);
    expect(res).eql([[name, color(name), 1]]);
  });

  it('Yellow, no store to file', async () => {
    const name = 'Pink';
    const image = await color().imageByName(name);
    const [r, g, b] = image.data;
    expect([r, g, b]).eql(color(name));
  });
});

describe('Set Palette', () => {
  it('get name palattes', async () => {
    const names = color().paletteNames();
    expect(names).eql(['web', 'bw']);
  });

  it('set bw palette', () => {
    color().setPalette('bw');
  });

  it('get palette', () => {
    const palette = color().getPalette();
    expect(palette).eql({ Black: [0, 0, 0], White: [255, 255, 255] });
  });

  it('set default palette', () => {
    color().setPalette();
  });

  it('Default palette has red color', () => {
    const palette = color().getPalette();
    expect(palette.Red).eql([255, 0, 0]);
  });

  it('set default palette in case of unknown palette', () => {
    color().setPalette('none');
  });

  it('Default palette has green color', () => {
    const palette = color().getPalette();
    expect(palette.Green).eql([0, 128, 0]);
  });
});

describe('Errors', () => {
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

  it('check empty object', () => {
    try {
      color({});
    } catch (result) {
      expect(result instanceof Error).equal(true);
      expect(String(result)).match(/^Error: Color must to be/);
    }
  });

  it('check object with r key', () => {
    try {
      color({ r: 'key' });
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
      expect(String(err)).match(/^Error: ENOENT: no such file or directory/);
    }
  });
});
