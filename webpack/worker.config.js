/* eslint-disable import/no-commonjs */

const webpack = require('webpack');
const path = require('path');

module.exports = (env = { NODE_ENV: 'development' }) => ({
  target: 'webworker',
  devtool: 'source-map',
  entry: {
    'editor.worker': 'monaco-editor/esm/vs/editor/editor.worker.js',
    'json.worker': 'monaco-editor/esm/vs/language/json/json.worker',
    'css.worker': 'monaco-editor/esm/vs/language/css/css.worker',
    'html.worker': 'monaco-editor/esm/vs/language/html/html.worker',
    'ts.worker': 'monaco-editor/esm/vs/language/typescript/ts.worker',
  },
  output: {
    path: path.resolve(__dirname, '..', 'dist', 'workers'),
    filename: '[name].bundle.js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify(env.NODE_ENV) },
    }),
    // Ignore require() calls in vs/language/typescript/lib/typescriptServices.js
    new webpack.IgnorePlugin(
      /^((fs)|(path)|(os)|(crypto)|(source-map-support))$/,
      /vs(\/|\\)language(\/|\\)typescript(\/|\\)lib/
    ),
  ].concat(
    env.NODE_ENV === 'production'
      ? [
          new webpack.LoaderOptionsPlugin({ minimize: true, debug: false }),
          new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false },
            sourceMap: true,
          }),
          new webpack.optimize.ModuleConcatenationPlugin(),
        ]
      : [new webpack.NamedModulesPlugin(), new webpack.NoEmitOnErrorsPlugin()]
  ),
});