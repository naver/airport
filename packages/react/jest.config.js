module.exports = {
  cacheDirectory: '.cache/jest',
  roots: ['<rootDir>/src'],
  transform: {'^.+\\.tsx?$': 'ts-jest'},
  testMatch: ['**/__tests__/(*.)test.ts?(x)'],
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'json'
  ],
  coverageDirectory: '.coverage',
  collectCoverageFrom: [
    'src/**/*.ts?(x)',
    '!**/__tests__/(*.)test.ts?(x)',
  ],
  coverageReporters: [
    'html',
    'clover'
  ],
  testURL: 'http://localhost',
}
