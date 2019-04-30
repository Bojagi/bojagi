module.exports = {
  "presets": [
    ["@babel/env", {
      targets: {
        node: 8
      },
      "modules": false
    },
    ],
    "@babel/typescript"
  ],
  "plugins": [
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-object-rest-spread"
  ]
}