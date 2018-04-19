const { resolve } = require('path');

module.exports = {
    mode: 'production',
    entry: './src/',
    output: {
        filename: 'vue-basic-table.js',
        libraryTarget: "umd",
        path: resolve('dist'),
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.(js|vue)$/,
                loader: 'eslint-loader',
                exclude: /node_modules/
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            { test: /\.js$/,
                loader: 'babel-loader'
            }
        ]
    }
};