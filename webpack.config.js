const path = require('path');
require("babel-polyfill")
module.exports = [{
    entry: ['babel-polyfill', './index.js'],
    output: {
        filename: 'jdom.js',
        path: path.resolve(__dirname, 'dist'),
        libraryExport: 'default',
        libraryTarget: 'umd',
        globalObject: 'this',
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }

}];