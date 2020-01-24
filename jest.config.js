module.exports = {
  transform: {
    ".(ts|tsx|js)": "ts-jest"
  },
  testRegex: "(/__tests__/.*|\\.(test|spec))\\.(ts|tsx)$",
  moduleFileExtensions: [
    "ts",
    "js"
  ],
  testEnvironment: "node"
}
