module.exports = {
  transform: {
    ".(ts|tsx|js)": "ts-jest"
  },
  testRegex: "\\.(integration)\\.(local)\\.(ts|tsx)$",
  moduleFileExtensions: [
    "ts",
    "js"
  ],
  testEnvironment: "node",
}
