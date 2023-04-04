module.exports = {
  transform: {
    '^.+\\.js$': 'esbuild-jest'
  },
  testTimeout: 10000,
  testEnvironment: 'jsdom',
};
