const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.ProgressPlugin((percentage, message, ...args) => {
      console.info(percentage, message, ...args);
    })
  ]
};
