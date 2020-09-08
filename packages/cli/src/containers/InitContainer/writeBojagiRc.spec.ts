import { writeBojagiRc } from './writeBojagiRc';

const expectedRcFile = `module.exports = {
  storyPath: 'src/storypath/',
};`;

test('Write bojagi rc file', () => {
  const fsMock: any = {
    writeFileSync: jest.fn(),
  };
  writeBojagiRc(fsMock, '/abc/', {
    storyPath: 'src/storypath/',
  });
  expect(fsMock.writeFileSync).toHaveBeenCalledTimes(1);
  expect(fsMock.writeFileSync).toHaveBeenCalledWith('/abc/.bojagirc.js', expectedRcFile);
});
