const path = require('path');
const isDevelopment = process.env.NODE_ENV === 'development';
const nodeExternals = require('webpack-node-externals');
const TerserPlugin = require('terser-webpack-plugin');
module.exports = [
  {
    mode: 'production',
    target: 'web',
    entry: './src/index.js',
    output: {
      filename: 'event.modulator.browser.js',
      path: path.resolve(__dirname, 'dist'),
    },
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin()],
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env'
                  , {
                    targets: {
                      browsers: ['last 2 versions', 'safari >= 7'],
                    },
                    modules: 'umd',
                  }
                , ]
              , ],
            },
          },
        }
      , ],
    },
  }
  , {
    mode: 'production',
    target: 'node',
    entry: './src/index.js',
    output: {
      filename: 'event.modulator.js',
      path: path.resolve(__dirname, 'dist'),
      libraryTarget: 'commonjs2',
    },
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin()],
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env'
                  , {
                    targets: {
                      node: '10',
                    },
                    modules: 'commonjs',
                  }
                , ]
              , ],
            },
          },
        }
      , ],
    },
    externals: [nodeExternals()],
  }
, ];