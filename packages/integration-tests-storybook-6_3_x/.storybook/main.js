const { withTestResult } = require("@bojagi/integration-test-utils")

module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ],
  babel: withTestResult('storybookBabel', async options => options),
  webpackFinal: withTestResult('storybookWebpackFinal', async config => config)
}