/**
 * A sample webpack configuration covering the following needs:
 * - multiple entry points: if you want to generate multiple js files as output
 * - common bundle (aka "vendor" bundle): a js bundle that contains all common junks from your entry points
 * - ES2015 transpilation
 * - react and jsx support
 * - sass compilation
 * - bootstrap css, font awesome, jquery
 * - Demonstration of using "legacy" code mixed with react components
 */
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');


// Define some paths globally
const PATHS = {
    src: path.join(__dirname, 'src'),
    build: path.join(__dirname, 'build'),
    sass: path.join(__dirname, 'sass')
};

// Plugin to extract CSS from the loaders and put it into a file:
const extractSass = new ExtractTextPlugin({
    filename: "[name].css"
});

/**
 * Common config object: Used for both production AND development build.
 * Merged later with webpack-merge.
 */
const commonConf = merge([{
    entry: {
        /**
         * The vendors bundle contains the vendor libraries.
         * See resolve/alias and CommonsJunk plugin below.
         * The common junks go to common.js, as defined in the CommonsJunk plugin below.
         */
        vendor: ['pixi','p2','phaser'],
        'game': path.join(PATHS.src, 'main.js'),
        // the SASS entry point: This could also be imported within a JS file, but
        // I find it better if declared outside JS, as the CSS is NOT embedded
        // into the JS but extracted as file:
        // style: path.join(PATHS.sass, 'main.scss')
    },

    // the output path and junk filenames:
    output: {
        path: PATHS.build,
        filename: '[name].js',
    },
    module: {
        rules: [{
            test: /pixi\.js/,
            use: ['expose-loader?PIXI']
        },{
            test: /p2\.js/,
            use: ['expose-loader?p2']
        },{
            test: /phaser-split\.js/,
            use: ['expose-loader?Phaser']
        },{
            // Rule for processing js(x) files, transforming jsx and es2015
            test: /\.js$/,
            include: [
                PATHS.src
            ],
            use: {
                loader: 'babel-loader',
                options: {
                    plugins: ['transform-runtime'],
                    presets: ['es2015']
                }
            }
        }, {
            // rule for compiling scss into css, not as url source, but to be stored into a file by the text-extract plugin:
            test: /\.scss$/,
            include: [path.join(__dirname, 'sass')],
            use: extractSass.extract({
                use: [{
                    loader: 'css-loader'
                }, {
                    loader: 'sass-loader',
                    options: {
                        includePaths: [PATHS.sass],
                        outputStyle: process.env.NODE_ENV === 'production' ? 'compressed' : 'nested'
                    }
                }]
            })
        }, {
            // rule for inlining font files:
            test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
            use: {
                loader: 'url-loader?limit=10000&mimetype=application/font-woff'
            }
        }, {
            // rule for processing font files and creating junks( not embedding ):
            test: /\.(eot|svg|ttf)(\?v=\d+\.\d+\.\d+)?$/,
            use: {
                loader: 'file-loader'
            }
        }]
    },
    plugins: [
        extractSass, // sass/css text extraction into files
        // globally available vars:
        // commons junk: build vendor and common js junk
        new webpack.optimize.CommonsChunkPlugin({
            name: ['vendor'],
            minChunks: Infinity
        })
    ],
    resolve: {
        alias: {
            // aliases for external libraries:
            'pixi': path.resolve(__dirname, 'node_modules/phaser-ce/build/custom/pixi.js'),
            'p2': path.resolve(__dirname, 'node_modules/phaser-ce/build/custom/p2.js'),
            'phaser': path.resolve(__dirname, 'node_modules/phaser-ce/build/custom/phaser-split.js'),
        }
    }
}]);

// development config: create source maps:
const devConf = merge([{
    devtool: 'source-map'
}]);

// production config: no source maps, uglify:
const prodConf = merge([{
    devtool: false,
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new UglifyJSPlugin()
    ]
}]);

// decide which config to use based on the node env:
if (process.env.NODE_ENV === 'production') {
    module.exports = merge(commonConf, prodConf);
} else {
    module.exports = merge(commonConf, devConf);
}

