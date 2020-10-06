#!/usr/bin/env node

const path = require('path')
const fs = require('fs')

const projectName = process.argv[2]
const projectPath = path.resolve(__dirname, '..', 'foreignIntegrationTests', projectName)
const packagePath = path.resolve(projectPath, 'package.json')

const package = require(packagePath)

const blacklistedDeps = [
  "@storybook/addon-a11y",
  // "@storybook/addon-actions",
  "@storybook/addon-backgrounds",
  // "@storybook/addon-docs",
  "@storybook/addon-events",
  "@storybook/addon-jest",
  "@storybook/addon-knobs",
  // "@storybook/addon-links",
  "@storybook/addon-storyshots",
  "@storybook/addons",
  "@storybook/client-logger",
  // "@storybook/react",
  "@storybook/theming",
]

function filterStoryBookDeps(package) {
  const { devDependencies, ...rest } = package

  return {
    ...rest,
    devDependencies: Object.entries(devDependencies)
      .filter(([key]) => !blacklistedDeps.includes(key))
      .reduce((r, [lib, version]) => ({...r, [lib]: version}), {}),
  }
}

fs.writeFileSync(packagePath, JSON.stringify(filterStoryBookDeps(package), null, '  '))