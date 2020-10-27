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
  reporters: [
    'default', // keep the default reporter
    [
      'differencify-jest-reporter',
      {
        debug: true,
        reportPath: 'differencify_reports', // relative to root of project
        reportTypes: {
          html: 'index.html',
          json: 'index.json',
        },
      },
    ],
  ],
}
