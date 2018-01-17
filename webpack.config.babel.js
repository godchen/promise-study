const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: path.join(__dirname,'src/main.js'),
    output: {
        path: __dirname,
        filename: './build/bundle.js'
    },
    devServer: {
        inline: true,
        port: 8090
    },
    module:{
        loaders:[
            {
                test: /\.js?$/,
                loader: 'babel-loader',
                include: path.join(__dirname,'src'),
                query: {
                    "presets": ["es2015"]
                }
            }
        ]
    },
    plugins: [new HtmlWebpackPlugin({
        template: './src/index.html'
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
};