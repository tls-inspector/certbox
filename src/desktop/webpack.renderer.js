const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CspHtmlWebpackPlugin = require('csp-html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

let devtool = 'source-map';
let sourceType = 'development';
if (process.env.NODE_ENV === 'production') {
    devtool = undefined;
    sourceType = 'production.min';
}

module.exports = {
    mode: sourceType,
    devtool: devtool,
    watchOptions: {
        followSymlinks: true
    },
    entry: './src/index.tsx',
    resolve: {
        symlinks: false,
        extensions: ['.ts', '.tsx', '.js', '.html', '.json']
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/html/index.html'
        }),
        new CspHtmlWebpackPlugin({
            'script-src': []
        }),
        new CopyPlugin({
            patterns: [
                { from: 'src/icons/certbox.png', to: 'assets/img/' },
            ]
        }),
        new ESLintPlugin({
            extensions: ['.ts', '.tsx', '.js', '.jsx'],
            configType: 'flat'
        }),
    ],
    target: 'electron-renderer',
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader'
                    }
                ]
            },
            {
                test: /\.(woff|woff2)$/,
                type: 'asset/inline',
            },
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader'
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'sass-loader'
                    }
                ]
            },
        ]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'app.js',
        hashFunction: 'xxhash64',
    },
};
