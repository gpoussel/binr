module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ["packages/**/*.{js}", "!**/node_modules/**"],
  roots: ["packages/"],
  testMatch: ["**/(*.)+\\.test.js"],
};
