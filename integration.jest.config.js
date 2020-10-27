module.exports = {
  transform: {
    ".(ts|tsx|js)": "ts-jest"
  },
  testRegex: "(/__tests__/.*|\\.(integration))\\.(ts|tsx)$",
  moduleFileExtensions: [
    "ts",
    "js"
  ],
  testEnvironment: "node",
}
