const path = require('path');
const fs = require('fs');

const cliPath = process.argv[2]
const devDependencies = require(`${cliPath}/package.json`).devDependencies

Object.keys(devDependencies).forEach(rmDependency)

function rmDependency(dependency) {
  // we remove no hoisted dev dependencies to prevent side effects 
  try {
    fs.rmdirSync(path.resolve(cliPath, 'node_modules', dependency), {
      recursive: true
    })
  } catch(e) {
    console.log(e)
  }
}