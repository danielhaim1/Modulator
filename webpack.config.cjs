const webpack = require('webpack');
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
// Remove nodeExternals if not strictly needed, especially for browser builds
// const nodeExternals = require("webpack-node-externals");

const packageJson = require('./package.json'); // Use packageJson consistently

const banner =
    `/*!
 * ${packageJson.name} - v${packageJson.version} - ${new Date().toISOString().split('T')[0]}
 * ${packageJson.repository.url}
 * Copyright (c) ${new Date().getFullYear()} ${packageJson.author.name}, Licensed ${packageJson.license}
 */`;

// Common Terser options for minification
const terserOptions = {
    extractComments: false, // Do not extract comments to a separate file
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs in production
      },
      format: {
        comments: /^\/*!/i, // Keep banner comment
      },
    },
};

// Common Babel Loader options (can be used after ts-loader if needed for older targets)
// const babelLoaderOptions = { ... }

// Base configuration shared across builds
const baseConfig = {
    mode: "production",
    devtool: 'source-map', // Enable source maps
    module: {
        rules: [
            {
                test: /\.ts$/, // Target TypeScript files
                exclude: /node_modules/,
                use: 'ts-loader', // Use ts-loader
                // Optionally chain babel-loader here if needed for older targets:
                // use: ['babel-loader', 'ts-loader']
            },
             // If you still need Babel for JS files (e.g., top-level index.js)
             {
                 test: /\.js$/,
                 exclude: /node_modules/,
                 use: {
                     loader: "babel-loader",
                     // Ensure babel config aligns with targets if used
                 }
             }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js'], // Resolve both TS and JS files
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
};


module.exports = [
    // --- CommonJS Build ---
    {
        ...baseConfig,
        target: "node",
        entry: "./src/index.ts",
        output: {
            filename: "modulator.cjs",
            path: path.resolve(__dirname, "dist"),
            libraryTarget: "commonjs2",
            clean: true,
        },
        // externals: [nodeExternals()], // Optional
    },
    // --- ES Module Build ---
    {
        ...baseConfig,
        target: "web",
        entry: "./src/index.ts",
        experiments: { outputModule: true, },
        output: {
            filename: "modulator.esm.js",
            path: path.resolve(__dirname, "dist"),
            library: {
              type: 'module', // Output as ES module
            },
            // No clean: true here, let the first build handle it
        },
    },
    // --- UMD Build ---
    {
        ...baseConfig,
        target: "web",
        entry: "./src/index.ts",
        output: {
            filename: "modulator.umd.js",
            path: path.resolve(__dirname, "dist"),
            library: "Modulator", // Global variable name
            libraryTarget: "umd", // UMD format
            globalObject: 'this', // Define global context for UMD
            umdNamedDefine: true, // Name the AMD module
        },
        // Adjust Babel targets here if using Babel + TS for older browser support
    },
    // --- AMD Build (Adding back) ---
    {
        ...baseConfig,
        target: "web", // Typically for browser AMD loaders
        entry: "./src/index.ts",
        output: {
            filename: "modulator.amd.js", // Specific AMD filename
            path: path.resolve(__dirname, "dist"),
            library: "Modulator", // Optional: Define the module name for AMD
            libraryTarget: "amd", // Set library target to AMD
        },
        // Note: No clean: true here
    }
];