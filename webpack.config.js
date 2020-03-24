// This is the "development" configuration for Webpack, for production use webpack.dist.config.js
// Code has been commented below describing what each configuration step is doing

const webpack = require('webpack');
const path = require('path');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');

module.exports = {
  // specify the root module for our application aka entry point
  // the react-hot-loader/patch preceeds this bc react-hot-loader@beta.7
  entry: {
    bundle: ['babel-polyfill', 'react-hot-loader/patch', './src/index.js'],
  },

  // what type of source maps to use
  devtool: 'eval-source-map',

  // where the compiled code is placed
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash].js',
  },

  // what file extensions should webpack look for
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.geojson'],
  },

  // what to do with different types of modules, e.g. sass, js, jsx, json, geojson
  module: {
    rules: [
      // Lint JS and transpile ES6 to ES5
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      // Use Sass and transpile to CSS
      // PostCSS is included here so that we can use things like AutoPrefixer
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader', // creates style nodes from JS strings
          },
          {
            loader: 'css-loader', // translates CSS into CommonJS
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
            loader: 'sass-loader', // compiles Sass to CSS
          },
          // allows for importing variables via JS or JSON files
          {
            loader: '@epegzz/sass-vars-loader',
            options: {
              files: [path.resolve(__dirname, 'src/common/styleVars.js')],
            },
          },
        ],
      },
      // allows for using ES6 import for JSON and GeoJSON files, no async loading!
      {
        test: /\.(json|geojson)$/,
        use: 'json-loader',
      },
      // load svg files as React Components, because why not?
      {
        test: /\.svg$/,
        use: [
          'babel-loader',
          {
            loader: 'svgr/lib/webpack',
            options: {
              svgo: false,
              icon: true,
            },
          },
        ],
      },
      // load images
      // url-loader will base64 encode images smaller than options.limit
      // otherwise it behaves just like file-loader
      {
        test: /\.(jpe?g|png|gif)$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
        },
      },
      // load local fonts if they exist
      // for more info see https://survivejs.com/webpack/loading/fonts/
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[ext]',
        },
      },
    ],
  },

  // webpack dev-server configuration
  devServer: {
    compress: true, // use compression
    port: 8889, // what port on localhost content will be served from
    hotOnly: true, // for hot-module-replacement
  },

  plugins: [
    // lints CSS, see the .stylelintrc.json file for more or to customize
    new StyleLintPlugin({
      configFile: '.stylelintrc.json',
      files: '**/*.scss',
      failOnError: false,
      quiet: false,
      syntax: 'scss',
    }),

    // set the process.env.NODE_ENV var to "development"
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),

    // enable hot-module-replacement
    new webpack.HotModuleReplacementPlugin(),

    // codesplitting: vendor libraries
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      // eslint-disable-next-line
      minChunks: function(module) {
        // this assumes your vendor imports exist in the node_modules directory
        return module.context && module.context.indexOf('node_modules') !== -1;
      },
    }),

    // codesplitting: source
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity,
    }),

    // allows for appending script and link tags for bundled JS and CSS
    new HTMLWebpackPlugin({
      template: 'src/index.html',
    }),

    // desktop notification when webpack updates
    new WebpackNotifierPlugin({ alwaysNotify: true }),
  ],
};
