/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  globalSetup: "./node_modules/@shelf/jest-mongodb/setup.js",
  globalTeardown: "./node_modules/@shelf/jest-mongodb/teardown.js",
  roots: ["<rootDir>/src", "<rootDir>/test"],
  collectCoverageFrom: ["<rootDir>/src/**/*.ts", "!<rootDir>/src/main/**"],
};
