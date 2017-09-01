/* eslint-env node */
/* eslint-disable import/no-commonjs, import/no-extraneous-dependencies */

const webpack = require('webpack');
const path = require('path');

const PORT = 3000;

const entry = ['./src/index.js'];

module.exports = (env = { NODE_ENV: 'development' }) => ({
  devtool: 'source-map',
  entry:
    env.NODE_ENV === 'production'
      ? entry
      : [
          `webpack-dev-server/client?http://localhost:${PORT}`,
          'webpack/hot/only-dev-server',
          ...entry,
        ],
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/build/',
    filename: 'bundle.js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify(env.NODE_ENV) },
    }),
  ].concat(
    env.NODE_ENV === 'production'
      ? [
          new webpack.LoaderOptionsPlugin({ minimize: true, debug: false }),
          new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false },
            sourceMap: true,
          }),
        ]
      : [
          new webpack.HotModuleReplacementPlugin(),
          new webpack.NamedModulesPlugin(),
          new webpack.NoEmitOnErrorsPlugin(),
        ]
  ),
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{ loader: 'babel-loader' }],
      },
      {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
      },
    ],
  },
  devServer: {
    contentBase: 'static/',
    hot: true,
    port: PORT,
  },
});