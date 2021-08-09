const path = require('path')
module.exports = {
  mode: 'development',
  // mode: 'production',
  entry: ['./src/assets/js/sample.ts'],
  output: {
    path: `${__dirname}/dist/assets/js/`,
    filename: 'bundle.js'
  },
  module: {
   rules: [
    {
      test: /\.ts$/,
      exclude: /node_modules/,
      loader: "ts-loader"
    }
   ]
  },
  resolve: {
   extensions: [
    '.ts', '.js'
   ]
  }
 }