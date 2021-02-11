const { withTestResult } = require("@bojagi/integration-test-utils")

module.exports = {
  "stories": [
    "../src/**/*.stoories.mdx", 
    "../src/**/*.stoories.@(js|jsx|ts|tsx)" // make sure we use some non default endings here
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ],
  babel: withTestResult('storybookBabel', async options => options),
  webpackFinal: withTestResult('storybookWebpackFinal', async config => config)
}