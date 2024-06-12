module.exports = {
  transform: {
    '^.+\\.js$': [require.resolve('esbuild-jest'), { sourcemap: true }]
  },
  testTimeout: 10000,
  testEnvironment: 'jsdom',
};