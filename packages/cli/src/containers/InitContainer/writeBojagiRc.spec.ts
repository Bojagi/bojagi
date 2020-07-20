import { writeBojagiRc } from './writeBojagiRc';

const expectedRcFile = `module.exports = {
  src: 'srcFolder/',
};`;

test('Write bojagi rc file', () => {
  const fsMock: any = {
    writeFileSync: jest.fn(),
  };
  writeBojagiRc(fsMock, '/abc/', {
    srcFolder: 'srcFolder/',
  });
  expect(fsMock.writeFileSync).toHaveBeenCalledTimes(1);
  expect(fsMock.writeFileSync).toHaveBeenCalledWith('/abc/.bojagirc.js', expectedRcFile);
});
