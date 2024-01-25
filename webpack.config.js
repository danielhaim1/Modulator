const webpack = require('webpack');
const path = require ( "path" ),
	isDevelopment = "development" === process.env.NODE_ENV,
	nodeExternals = require ( "webpack-node-externals" ),
	TerserPlugin = require ( "terser-webpack-plugin" );

const package = require('./package.json');

const banner =
    `/*!
 * ${package.name} - v${package.version} - ${new Date().toISOString().split('T')[0]}
 * ${package.repository.url}
 * Copyright (c) ${new Date().getFullYear()} ${package.author.name}, Licensed ${package.license}
 */`;

const terserOptions = {
    extractComments: false,
};

module.exports = [ {
    mode: "production",
	target: "web",
	entry: "./index.js",
	output: {
		filename: "modulator.amd.js",
		path: path.resolve ( __dirname, "dist" )
	},
	optimization: {
        minimize: true,
        minimizer: [new TerserPlugin(terserOptions)],
    },
    plugins: [
        new webpack.BannerPlugin({
            banner: banner,
            raw: true
        })
    ],
	module: {
		rules: [ {
			test: /\.js$/,
			exclude: /(node_modules|bower_components)/,
			use: {
				loader: "babel-loader",
				options: {
					presets: [ [ "@babel/preset-env", {
						targets: {
							browsers: [ "last 5 versions", "safari >= 7" ]
						},
						modules: "amd"
					}, ], ]
				}
			}
		}, ]
	}
}, {
    mode: "production",
	target: "node",
	entry: "./index.js",
	output: {
		filename: "modulator.module.js",
		path: path.resolve ( __dirname, "dist" ),
		libraryTarget: "commonjs2"
	},
	optimization: {
        minimize: true,
        minimizer: [new TerserPlugin(terserOptions)],
    },
    plugins: [
        new webpack.BannerPlugin({
            banner: banner,
            raw: true
        })
    ],
	module: {
		rules: [ {
			test: /\.js$/,
			exclude: /(node_modules|bower_components)/,
			use: {
				loader: "babel-loader",
				options: {
					presets: [ [ "@babel/preset-env", {
						targets: {
							node: "10"
						},
						modules: "commonjs"
					}, ], ]
				}
			}
		}, ]
	},
	externals: [ nodeExternals () ]
}, ];