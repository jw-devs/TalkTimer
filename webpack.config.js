var webpack = require("webpack");


module.exports = {
  entry: {
    timer: "./timer.js",
    index: "./index.js"
  },
  output: {
    path: "bundle",
    filename: "[name].js"
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel?presets[]=es2015&presets[]=react&presets[]=stage-0" },
      { test: /\.css$/, loader: "style!css" },
      { test: /\.eot|\.svg|\.ttf|\.woff2?$/, loader: "file" }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    })
  ]
}
