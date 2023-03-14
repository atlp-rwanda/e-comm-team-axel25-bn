/** @type {import('ts-jest').JestConfigWithTsJest} */
// eslint-disable-next-line no-undef
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/**/*.spec.ts"],
  testTimeout: 250000,
  verbose: true,
  forceExit: true,
  // clearMocks: true,
  // resetMocks: true,
  // restoreMocks: true,
};
