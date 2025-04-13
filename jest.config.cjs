module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testTimeout: 10000,
  clearMocks: true,
  coverageProvider: "v8",
  testMatch: [
    "**/__tests__/**/*.test.ts",
    "**/?(*.)+(spec|test).ts"
  ],
};