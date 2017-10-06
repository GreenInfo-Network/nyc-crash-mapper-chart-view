// This is the "production" configuration for Webpack.
// Note that there is a lot of overlap with the "development" configuration, this could be avoided
// by using Webpack's "advanced configuration" (TO DO...)
//
// This configuration includes some extra goodies such as:
// -- Uglify to minify & compress JS more than Webpack will do own its own (I think?)
// -- If you use Moment.js it will ignore Moment's locales files which tend to be really large and
//    most of the time aren't needed.
// -- It will also create compressed versions of bundled files. This can drastically speed up loadin
//    time (especially on mobile!) when a server is configured to send them
// -- Any files you have specified in "assets" will be copied to the "dist/" directory, this
//    technique could be used for other directories as well, such as "data/" for example
// -- Source maps for this configuration are smaller than what is produced by the dev config

const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const extractSass = new ExtractTextPlugin({
  filename: '[name].[chunkhash].css',
  disable: process.env.NODE_ENV === 'development',
});

module.exports = {
  entry: {
    bundle: './src/index.js',
  },
  cache: false,
  devtool: 'cheap-module-source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash].js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.geojson'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.scss$/,
        use: extractSass.extract({
          use: [
            {
              loader: 'css-loader',
            },
            {
              loader: 'postcss-loader', // postcss loader so we can use autoprefixer
              options: {
                config: {
                  path: 'postcss.config.js',
                },
              },
            },
            {
              loader: 'sass-loader',
            },
          ],
          fallback: [
            {
              loader: 'style-loader',
            },
          ],
        }),
      },
      {
        test: /\.(json|geojson)$/,
        use: 'json-loader',
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
        },
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[ext]',
        },
      },
    ],
  },
  plugins: [
    new UglifyJSPlugin({
      test: /\.(js|jsx)$/,
      mangle: false,
      sourceMap: true,
      compress: {
        dead_code: true,
        warnings: false, // Suppress uglification warnings
        screw_ie8: true,
      },
      exclude: [/\.min\.js$/gi], // skip pre-minified libs && css
    }),
    extractSass,
    new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/]),
    // codesplitting: vendor libraries
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      // eslint-disable-next-line
      minChunks: function(module) {
        // this assumes your vendor imports exist in the node_modules directory
        return module.context && module.context.indexOf('node_modules') !== -1;
      },
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity,
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"',
    }),
    new HTMLWebpackPlugin({
      template: 'src/index.html',
    }),
    // tell Webpack to copy static assets (images, icons, etc.) to dist/
    new CopyWebpackPlugin([{ from: 'assets/', to: 'assets/' }]),
  ],
};
