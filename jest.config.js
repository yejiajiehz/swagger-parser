module.exports = {
  verbose: true,
  notify: true,
  testEnvironment: 'node',
  collectCoverage: true,
  roots: ['<rootDir>/__tests__'],
  modulePaths: ['<rootDir>/dist/es5'],
  moduleDirectories: ['<rootDir>/__mocks__', 'node_modules'],
  coverageReporters: ['html', 'text', 'text-summary'],
}
