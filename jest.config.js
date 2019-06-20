module.exports = {
  roots: ["packages/"],
  testMatch: ["**/*\\.test.[jt]s"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
};
